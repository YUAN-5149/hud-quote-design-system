import { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.jsx';

export const Panel = ({ title, meta, children, accent, className = '', style = {} }) => (
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

export const Metric = ({ label, value, delta, deltaKind = 'ok', sub, accent }) => (
  <div className="metric">
    <div className="metric-label mono-label">{label}</div>
    <div className={`metric-value ${accent ? 'accent' : ''}`}>{value}</div>
    {sub && <div className="metric-sub mono-label">{sub}</div>}
    {delta && <div className={`metric-delta ${deltaKind}`}>{delta}</div>}
  </div>
);

export const Chip = ({ kind = 'info', children, code }) => (
  <span className={`chip chip-${kind} ${code ? 'chip-code' : ''}`}>
    {!code && <span className={`chip-dot chip-dot-${kind}`} />}
    {children}
  </span>
);

export const Button = ({ variant = 'primary', children, onClick, disabled, icon }) => (
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

export const Field = ({ label, children, helper, error }) => (
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

export const Input = (props) => <input className="input" {...props} />;

// 可輸入也可從清單挑選的欄位：右側 ▼ 展開全部選項，打字時依關鍵字篩選
// groups: [{ label, items: [{ value, hint }] }] — 依陣列順序排列（前面的優先）
export const ComboInput = ({ value, onChange, groups, disabled, ...props }) => {
  const [open, setOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [pos, setPos] = useState(null);
  const boxRef = useRef(null);
  const listRef = useRef(null);
  // 清單以 fixed 定位浮在最上層，避免被彈窗的捲動區裁切；捲動或縮放時跟著重新定位
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = boxRef.current?.getBoundingClientRect();
      if (!r) return;
      const below = window.innerHeight - r.bottom - 12;
      const up = below < 160 && r.top > below;
      setPos({ left: r.left, width: r.width, maxHeight: Math.min(260, (up ? r.top : below) - 4), ...(up ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }) });
    };
    // 點在欄位與清單以外的地方就收合（Safari 點按鈕不會取得焦點，不能只靠 blur）
    const away = (e) => {
      if (!boxRef.current?.contains(e.target) && !listRef.current?.contains(e.target)) { setOpen(false); setFiltering(false); }
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    document.addEventListener('mousedown', away);
    document.addEventListener('touchstart', away);
    return () => {
      window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true);
      document.removeEventListener('mousedown', away); document.removeEventListener('touchstart', away);
    };
  }, [open]);
  const q = filtering ? String(value || '').trim().toLowerCase() : '';
  const shown = groups
    .map(g => ({ ...g, items: g.items.filter(it => !q || it.value.toLowerCase().includes(q) || (it.hint || '').toLowerCase().includes(q)) }))
    .filter(g => g.items.length);
  const hasAny = groups.some(g => g.items.length);
  const pick = (v) => { onChange(v); setOpen(false); setFiltering(false); };
  return (
    <div className="combo" ref={boxRef} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) { setOpen(false); setFiltering(false); } }}>
      <input
        className="input combo-input" value={value} disabled={disabled} {...props}
        onChange={(e) => { onChange(e.target.value); setFiltering(true); setOpen(true); }}
        onKeyDown={(e) => { if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); } }}
      />
      {!disabled && hasAny && (
        <button
          type="button" className={`combo-toggle ${open ? 'is-open' : ''}`} aria-label="展開已建立的選項"
          onClick={(e) => { e.preventDefault(); setFiltering(false); setOpen(o => !o); }}
        />
      )}
      {open && !disabled && pos && shown.length > 0 && createPortal(
        <div className="combo-list" role="listbox" style={pos} ref={listRef}>
          {shown.map(g => (
            <div key={g.label}>
              <div className="combo-group mono-label">{g.label}</div>
              {g.items.map(it => (
                <button
                  type="button" key={g.label + it.value} className="combo-item"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => { e.preventDefault(); pick(it.value); }}
                >
                  <span className="combo-val">{it.value}</span>
                  {it.hint && <span className="combo-hint">{it.hint}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
};

export const Toggle =({ on, onChange, label }) => (
  <div className="toggle-row" onClick={() => onChange(!on)}>
    <span className={`toggle ${on ? 'toggle-on' : ''}`} />
    <span className="toggle-lbl">{label}</span>
  </div>
);

export const Modal = ({ open, onClose, title, meta, width = 520, children, footer }) => {
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

export const Select = ({ value, onChange, options }) => (
  <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

export { Icon };
