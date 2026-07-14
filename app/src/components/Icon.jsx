import {
  Activity, ArrowLeftRight, Check, Download, FilePlus, FileText, FolderKanban, KeyRound,
  LayoutGrid, Loader, LogIn, LogOut, Package, Pencil, Plus, Printer,
  Receipt, Save, Search, Send, Settings, ShieldAlert, ShieldCheck,
  Smartphone, Trash2, User, UserPlus, X,
} from 'lucide-react';

// 對應原型的 <i data-lucide="name"> 用法，維持 kebab-case 命名
// 只匯入有用到的圖示以維持 bundle 精簡；新增圖示時記得補進 MAP
const MAP = {
  'activity': Activity,
  'arrow-left-right': ArrowLeftRight,
  'check': Check,
  'download': Download,
  'file-plus': FilePlus,
  'file-text': FileText,
  'folder-kanban': FolderKanban,
  'key-round': KeyRound,
  'layout-grid': LayoutGrid,
  'loader': Loader,
  'log-in': LogIn,
  'log-out': LogOut,
  'package': Package,
  'pencil': Pencil,
  'plus': Plus,
  'printer': Printer,
  'receipt': Receipt,
  'save': Save,
  'search': Search,
  'send': Send,
  'settings': Settings,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  'smartphone': Smartphone,
  'trash-2': Trash2,
  'user': User,
  'user-plus': UserPlus,
  'x': X,
};

export const Icon = ({ name, size = 16, className = '' }) => {
  const L = MAP[name];
  if (!L) return null;
  return <L size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
};
