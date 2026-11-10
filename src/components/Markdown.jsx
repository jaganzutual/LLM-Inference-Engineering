import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const baseUrl = import.meta.env.BASE_URL;

function MarkdownLink({ node, href = '', children, ...props }) {
  const navigate = useNavigate();
  const isExternal = /^(https?:)?\/\//i.test(href);
  const isHash = href.startsWith('#');
  const isAppRoute =
    href === '/' || /^\/(topic|phase)(\/|$)/.test(href);

  if (isHash) {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          const target = document.getElementById(href.slice(1));
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }

  if (isAppRoute) {
    return (
      <a
        href={href}
        onClick={(event) => {
          event.preventDefault();
          navigate(href);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith('/')) {
    return (
      <a href={`${baseUrl}${href.replace(/^\//, '')}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

const components = {
  a: MarkdownLink,
  table: ({ node, ...props }) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  img: ({ node, src = '', alt = '', ...props }) => {
    const isExternal =
      /^(https?:)?\/\//i.test(src) ||
      src.startsWith('data:') ||
      src.startsWith('blob:');
    const resolved = isExternal
      ? src
      : `${baseUrl}${src.replace(/^\.?\//, '')}`;

    return <img src={resolved} alt={alt} loading="lazy" {...props} />;
  },
};

export default function Markdown({ children }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
