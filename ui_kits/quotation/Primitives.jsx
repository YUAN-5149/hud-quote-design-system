// Panel.jsx — reusable HUD panel primitive
const Panel = ({ title, meta, children, accent, className = '', style = {} }) => (
  <section
    className={`hud-panel ${accent ? 'hud-panel-active' : ''} ${className}`}
    style={style}
  >
    {(title || meta) && (
      <div className="hud-panel-header" style={{ fontSize: 12 }}>
        <span className="panel-title">{title}</span>
        {meta && <span className="panel-meta">{meta}</span>}
      </div>
    )}
    <div className="hud-panel-body">{children}</div>
  </section>
);

const Metric = ({ label, value, delta, deltaKind = 'ok', sub, accent }) => (
  <div className="metric">
    <div className="metric-label mono-label">{label}</div>
    <div className={`metric-value ${accent ? 'accent' : ''}`}>{value}</div>
    {sub && <div className="metric-sub mono-label">{sub}</div>}
    {delta && <div className={`metric-delta ${deltaKind}`}>{delta}</div>}
  </div>
);

const Chip = ({ kind = 'info', children, code }) => (
  <span className={`chip chip-${kind} ${code ? 'chip-code' : ''}`}>
    {!code && <span className={`chip-dot chip-dot-${kind}`} />}
    {children}
  </span>
);

const Button = ({ variant = 'primary', children, onClick, disabled, icon }) => (
  <button
    className={`btn btn-${variant}`}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <Icon name={icon} size={14} />}
    <span>{children}</span>
    {variant === 'primary' && <span className="btn-caret">›</span>}
  </button>
);

const Field = ({ label, children, helper, error }) => (
  <label className={`field ${error ? 'field-error' : ''}`}>
    <span className="field-label mono-label">{label}</span>
    {children}
    {(helper || error) && (
      <span className={`field-helper ${error ? 'is-error' : ''}`}>
        {error || helper}
      </span>
    )}
  </label>
);

const Input = (props) => <input className="input" {...props} />;

const Toggle = ({ on, onChange, label }) => (
  <div className="toggle-row" onClick={() => onChange(!on)}>
    <span className={`toggle ${on ? 'toggle-on' : ''}`} />
    <span className="toggle-lbl">{label}</span>
  </div>
);

const Modal = ({ open, onClose, title, meta, width = 520, children, footer }) => {
  if (!open) return null;
  return (
    <div className="modal-scrim" onClick={onClose}>
      <div
        className="modal hud-panel hud-panel-active"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="hud-panel-header">
          <span className="panel-title">{title}</span>
          <span className="panel-meta">
            {meta}
            <button className="modal-close" onClick={onClose} aria-label="close">×</button>
          </span>
        </div>
        <div className="hud-panel-body modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

const Select = ({ value, onChange, options }) => (
  <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

Object.assign(window, { Panel, Metric, Chip, Button, Field, Input, Toggle, Modal, Select });
