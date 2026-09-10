import { PROCESS_STEPS } from '@/shared/content/process.content';

/**
 * The shared studio process used wherever Finer Things explains how a project
 * moves from first research to installed work.
 */
export function OurProcess() {
  return (
    <section className="continuity process-section shared-process" id="process">
      <div className="wrap">
        <div className="continuity-head">
          <div className="eyebrow rise">Our process</div>
          <div>
            <h2 className="rise">
              {'New level of experience in pursuit of '}
              <em>perfection</em>
            </h2>
            <p className="continuity-note rise">
              We refined our process and production to guarantee uniqueness, meticulous
              craftsmanship and highest quality in every piece.
            </p>
          </div>
        </div>
        <ol className="process-steps">
          {PROCESS_STEPS.map((step, index) => (
            <li className="process-step rise" key={step}>
              <span className="process-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="process-label">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
