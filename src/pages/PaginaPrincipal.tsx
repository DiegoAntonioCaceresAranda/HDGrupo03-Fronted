import type { FC, ReactElement } from "react";

const PaginaPrincipal: FC = (): ReactElement => (
  <div className="container py-5">
    <h1>Menu Principal</h1>
    <p>
      Dirigirse a <a href="/admin/reports">/admin/reports</a> para ver el
      dashboard.
    </p>
  </div>
);

export default PaginaPrincipal;
