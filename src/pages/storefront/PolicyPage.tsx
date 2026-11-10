import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { RichTextViewer } from '../../components/common/RichTextViewer';
import { useData } from '../../context/DataContext';

type PolicyType = 'shopping' | 'return' | 'privacy';

export const PolicyPage: React.FC = () => {
  const { type } = useParams<{ type: PolicyType }>();
  const { siteContent } = useData();

  const currentType: PolicyType =
    type === 'return' || type === 'privacy' ? type : 'shopping';

  const policyMap: Record<PolicyType, { title: string; html: string }> = {
    shopping: {
      title: '購物與配送須知',
      html: siteContent.shoppingGuideHtml,
    },
    return: {
      title: '退換貨與商品保固政策',
      html: siteContent.returnPolicyHtml,
    },
    privacy: {
      title: '隱私權保護條款',
      html: siteContent.privacyPolicyHtml,
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-2">
        {(
          [
            ['shopping', '購物與配送須知'],
            ['return', '退換貨政策'],
            ['privacy', '隱私權條款'],
          ] as const
        ).map(([key, label]) => (
          <Link
            key={key}
            to={`/policies/${key}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              currentType === key
                ? 'bg-brand-primary text-text-on-primary shadow-sm'
                : 'border border-border-soft bg-bg-card text-text-secondary hover:bg-bg-surface'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <article className="card-warm p-6 sm:p-10">
        <div className="mb-4 flex items-center gap-2 border-b border-border-soft pb-4">
          <ShieldCheck className="h-5 w-5 text-brand-accent" />
          <h1 className="text-2xl font-extrabold text-text-primary">
            {policyMap[currentType].title}
          </h1>
        </div>
        <RichTextViewer html={policyMap[currentType].html} />
      </article>
    </div>
  );
};

