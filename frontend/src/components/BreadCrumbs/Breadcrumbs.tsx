import React from "react";
import { Link } from "react-router-dom";
import { type FC } from "react";
import { ROUTES } from "../../Routes";
import './BreadCrumbs.css';

interface ICrumb {
  label: string;
  path?: string;
}

export const BreadCrumbs: FC<{ crumbs: ICrumb[] }> = ({ crumbs }) => {
  // Не отображаем на главной странице
  if (crumbs.length === 0) return null;

  return (
    <div className="breadcrumbs-container">
        <nav className="breadcrumbs-nav">
            <Link to={ROUTES.HOME}>Главная</Link>
            {crumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    <span className="separator">/</span>
                    {crumb.path && index < crumbs.length - 1 ? (
                        <Link to={crumb.path}>{crumb.label}</Link>
                    ) : (
                        <span className="current">{crumb.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    </div>
  );
};
