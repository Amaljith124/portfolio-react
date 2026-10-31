import React from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from '../context/PortfolioContext';
import { DEFAULT_PORTFOLIO_SLUG } from '../data/defaultPortfolio';
import Home from '../pages/Home/Home';
import ProjectDetail from '../pages/ProjectDetail/ProjectDetail';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import ChatWidget from './ChatWidget/ChatWidget';
import ScrollToHash from './ScrollToHash';
import PortfolioSkeleton from './Skeleton/PortfolioSkeleton';

function Message({ title, text, retry }) {
  return (
    <main className="project-detail section-wrap" role="alert">
      <h1>{title}</h1>
      <p>{text}</p>
      {retry && <button className="button button-primary" onClick={retry}>Try again</button>}
      {!retry && <Link className="text-link" to="/">Go to the home page</Link>}
    </main>
  );
}

function Page() {
  const { status, features, retry } = usePortfolio();

  if (status === 'loading') {
    return <PortfolioSkeleton />;
  } else if (status === 'notfound') {
    return <Message title="Portfolio not found" text="This portfolio does not exist, or its link has expired or was revoked." />;
  } else if (status === 'error') {
    return <Message title="Could not load the portfolio" text="The server did not answer. Check your connection and try again." retry={retry} />;
  } else {
    return (
      <>
        <ScrollToHash />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="projects/:projectSlug" element={<ProjectDetail />} />
        </Routes>
        <Footer />
        {/* the server also refuses the chat API when the flag is off: hiding the widget is only the visible half */}
        {features.isAssistantEnabled && <ChatWidget />}
      </>
    );
  }
}

// "/" and "/projects/:slug": the default portfolio, exactly the URLs the site always had
export function DefaultPortfolio() {
  return <PortfolioProvider slug={DEFAULT_PORTFOLIO_SLUG} basePath=""><Page /></PortfolioProvider>;
}

// "/p/:slug" and "/p/:slug/projects/:projectSlug": the portfolio of any other user
export function UserPortfolio() {
  const { slug } = useParams();
  return <PortfolioProvider key={slug} slug={slug} basePath={`/p/${slug}`}><Page /></PortfolioProvider>;
}

// "/portfolio/:token" and "/portfolio/:token/projects/:projectSlug": the magic link of a user. The token is sent to the API,
// which answers with the portfolio JSON (or "not found" for an unknown / expired / revoked token).
export function MagicPortfolio() {
  const { token } = useParams();
  return <PortfolioProvider key={token} token={token} basePath={`/portfolio/${token}`}><Page /></PortfolioProvider>;
}
