import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.josevmorilla.me').replace(/\/$/, '');

const toAbsoluteUrl = (path) => {
  if (!path) return SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

const Seo = ({ title, description, path = '/', type = 'website', noindex = false }) => {
  const canonicalUrl = toAbsoluteUrl(path);
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Jose Villegas Morilla" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

Seo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  path: PropTypes.string,
  type: PropTypes.string,
  noindex: PropTypes.bool,
};

export default Seo;
