import Link from "next/link";
import { CustomCursor } from "@/components/custom-cursor";

export default function UnderConstructionPage() {
  return (
    <>
      <CustomCursor />
      <main className="construction-page">
        <div className="construction-card">
          <span className="meta">System loading error</span>
          <h1 className="construction-title">Page under construction.</h1>
          <p className="construction-copy">
            The documentation route exists, the content does not. Consider this a neat
            failure instead of a broken promise.
          </p>
          <div className="construction-terminal">
            <span>$</span>
            <span> docs module --status pending</span>
          </div>
          <div className="mt-6">
            <Link href="/" className="section-inline-button" data-cursor="Return">
              [ RETURN_HOME ]
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
