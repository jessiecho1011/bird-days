import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { dataService } from '../services/storageService';
import type { CartItem, Product, ProductVariant } from '../types';
import { useData } from './DataContext';

export interface HydratedCartItem {
  itemKey: string; // productId + variantId 的唯一組合鍵
  product: Product;
  variant?: ProductVariant;
  unitPrice: number;
  availableStock: number;
  quantity: number;
  lineTotal: number;
}

export interface FlyingCartDot {
  id: number;
  startX: number;
  startY: number;
  flyX: number;
  flyY: number;
}

export interface AddedNotice {
  key: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  hydratedItems: HydratedCartItem[];
  isDrawerOpen: boolean;
  flyingItems: FlyingCartDot[];
  cartBumpTick: number;
  lastAddedNotice: AddedNotice | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  removeFlyingItem: (id: number) => void;
  addToCart: (
    productId: string,
    quantity?: number,
    originEl?: HTMLElement | null,
    variantId?: string
  ) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function isSameCartEntry(a: CartItem, productId: string, variantId?: string): boolean {
  return a.productId === productId && (a.variantId || undefined) === (variantId || undefined);
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useData();
  const [items, setItems] = useState<CartItem[]>(() => dataService.getCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [flyingItems, setFlyingItems] = useState<FlyingCartDot[]>([]);
  const [cartBumpTick, setCartBumpTick] = useState(0);
  const [lastAddedNotice, setLastAddedNotice] = useState<AddedNotice | null>(null);
  const flySeqRef = useRef(0);
  const noticeTimerRef = useRef<number | null>(null);

  const persist = (next: CartItem[]) => {
    dataService.saveCart(next);
    setItems(next);
  };

  const removeFlyingItem = (id: number) => {
    setFlyingItems((prev) => prev.filter((d) => d.id !== id));
  };

  const triggerCartFeedback = (quantity: number) => {
    setCartBumpTick((t) => t + 1);
    setLastAddedNotice({ key: Date.now() + Math.random(), quantity });
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setLastAddedNotice(null);
    }, 1000);
  };

  const addToCart = (
    productId: string,
    quantity = 1,
    originEl?: HTMLElement | null,
    variantId?: string
  ) => {
    const product = products.find((p) => p.id === productId);
    let resolvedVariantId = variantId;
    if (!resolvedVariantId && product?.variants && product.variants.length > 0) {
      const available =
        product.variants.find((v) => v.stock > 0) ?? product.variants[0];
      resolvedVariantId = available.id;
    }

    const existing = items.find((i) =>
      isSameCartEntry(i, productId, resolvedVariantId)
    );
    const next = existing
      ? items.map((i) =>
          isSameCartEntry(i, productId, resolvedVariantId)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      : [...items, { productId, variantId: resolvedVariantId, quantity }];
    persist(next);

    // 計算飛向右上角購物籃按鈕的平滑拋物線座標
    const targetEl = document.querySelector<HTMLElement>('[data-cart-target="true"]');
    if (originEl && targetEl) {
      const originRect = originEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const startX = originRect.left + originRect.width / 2;
      const startY = originRect.top + originRect.height / 2;
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;
      const dotId = ++flySeqRef.current;

      setFlyingItems((prev) => [
        ...prev,
        {
          id: dotId,
          startX,
          startY,
          flyX: endX - startX,
          flyY: endY - startY,
        },
      ]);

      window.setTimeout(() => {
        triggerCartFeedback(quantity);
      }, 400);

      window.setTimeout(() => {
        removeFlyingItem(dotId);
      }, 650);
    } else {
      triggerCartFeedback(quantity);
    }
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variantId?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    persist(
      items.map((i) =>
        isSameCartEntry(i, productId, variantId) ? { ...i, quantity } : i
      )
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    persist(items.filter((i) => !isSameCartEntry(i, productId, variantId)));
  };

  const clearCart = () => {
    persist([]);
  };

  const hydratedItems = useMemo<HydratedCartItem[]>(() => {
    return items
      .map<HydratedCartItem | null>((item) => {
        const product = products.find((p) => p.id === item.productId && p.isActive);
        if (!product) return null;

        const variant = item.variantId
          ? product.variants?.find((v) => v.id === item.variantId)
          : product.variants?.[0];

        const unitPrice = variant ? variant.price : product.price;
        const availableStock = variant ? variant.stock : product.stock;

        return {
          itemKey: `${product.id}__${variant?.id ?? 'default'}`,
          product,
          variant,
          unitPrice,
          availableStock,
          quantity: item.quantity,
          lineTotal: unitPrice * item.quantity,
        };
      })
      .filter((x): x is HydratedCartItem => x !== null);
  }, [items, products]);

  const totalCount = useMemo(
    () => hydratedItems.reduce((sum, item) => sum + item.quantity, 0),
    [hydratedItems]
  );

  const subtotal = useMemo(
    () => hydratedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [hydratedItems]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        hydratedItems,
        isDrawerOpen,
        flyingItems,
        cartBumpTick,
        lastAddedNotice,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        removeFlyingItem,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart 必須在 CartProvider 內使用');
  return ctx;
}
