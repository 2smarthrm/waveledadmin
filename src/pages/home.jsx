 
import React, { useEffect, useMemo, useState, useRef } from 'react';
import axiosLib from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AsyncSelect from 'react-select/async';
import {
  Button,
  Modal,
  Form,
  Badge,
  Spinner,
  InputGroup,
  Row,
  Col,
  Ratio,
  Alert,
  Navbar,
  Nav,
  Container,
  Tabs,
  Tab,
  Card,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FiTrash2,
  FiEye,
  FiMoreHorizontal,
  FiHeart,
  FiPlus,
  FiEdit3,
  FiChevronDown,
  FiSave,
  FiUser,
  FiLogOut,
  FiSliders,
  FiGrid,
  FiVideo,
  FiStar,
  FiInbox,
  FiUsers,
  FiMessageSquare,
  FiThumbsUp,
  FiHome,
  FiLayers,
  FiList,
  FiImage,
  FiPackage,
  FiTag, 
  FiFolderPlus,
} from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa6';
import { TbCategory2 } from "react-icons/tb";

// === TABELA / DROPDOWN REUTILIZÁVEIS ===
import Table from '@/components/shared/table/Table';
import Dropdown from '@/components/shared/Dropdown';
import { toast, Toaster } from 'react-hot-toast';

const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";
const axios = axiosLib.create({ baseURL: API_BASE, withCredentials: true });
 
 
/* --------------------------------- HOOK ---------------------------------- */
function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    fn()
      .then((res) => { if (!alive) return; setData(res); })
      .catch((e) => setError(e?.response?.data?.error || e.message || 'Erro a carregar'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; }; 
  }, deps);
  return { data, loading, error, reload: () => fn().then(setData).catch(() => {}) };
}

/* ----------------------------- CONFIRM MODAL ------------------------------ */
function ConfirmDialog({
  show, title = 'Confirmar', body = 'Tens a certeza?',
  confirmText = 'Confirmar', onCancel, onConfirm, variant = 'danger', loading = false,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton><Modal.Title>{title}</Modal.Title></Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>Cancelar</Button>
        <Button variant={variant} onClick={onConfirm} disabled={loading}>
          {loading ? 'A processar…' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* --------------------------------- HEADER -------------------------------- */
function initialsFromName(n = '') {
  const parts = n.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}


function HeaderBar({ onLogout }) {
  const [me, setMe] = useState(null);
  useEffect(() => {
    axios.get('/api/auth/status').then((r) => setMe(r.data?.data)).catch(() => {});
  }, []);

  const name = me?.user?.name || 'Utilizador';
  const role = me?.user?.role || 'viewer';
  const avatarTxt = initialsFromName(name);

  return (
    <Navbar bg="white" expand="lg" className="rounded border px-3 mb-3" style={{ boxShadow: '0 1px 0 rgba(0,0,0,.03)' }}>
      <Container fluid className="px-0">
        <Navbar.Brand className="fw-semibold">Waveled • Dashboard</Navbar.Brand>
        <Nav className="ms-auto align-items-center">
          <div className="d-flex align-items-center gap-2 p-1 px-2 rounded border">
            <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32, fontSize: 12 }}>
              {avatarTxt}
            </div>
            <div className="d-none d-sm-block">
              <div className="small fw-semibold">{name}</div>
              <div className="small text-muted">{role}</div>
            </div>
            <div className="dropdown">
              <Button variant="light" size="sm" className="d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
                <FiChevronDown />
              </Button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" type="button"><FiUser className="me-2" />Perfil</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" type="button" onClick={onLogout}><FiLogOut className="me-2" />Terminar sessão</button></li>
              </ul>
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
}

/* --------------------------- SELECT COMPONENTS ---------------------------- */ 
function CategorySelect({ value, onChange, placeholder = 'Seleciona categoria…', isClearable = true, returnField = 'id' }) {
  const cache = useRef(new Map());
  const toOption = (c) => ({
    value: returnField === 'name' ? (c.wl_name || c.name) : (c._id || c.wl_id || c.value || c),
    label: c.wl_name || c.name || String(c),
  });

  const loadOptions = async (inputValue) => {
    const key = `${returnField}::${inputValue || '__ALL__'}`;
    if (cache.current.has(key)) return cache.current.get(key);
    const res = await axios.get('/api/categories', { params: { q: inputValue || undefined } });
    const list = (res.data?.data || []).map(toOption);
    cache.current.set(key, list);
    return list;
  };

  // quando returnField='name' não dá para carregar 1 categoria via /:id; mantemos o valor “como está”
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (!value) { setSelected(null); return; }
    if (returnField === 'name') { setSelected({ value, label: value }); return; }
    (async () => {
      try {
        const r = await axios.get(`/api/categories/${value}`);
        const c = r.data?.data;
        setSelected(c ? toOption(c) : { value, label: value });
      } catch {
        setSelected({ value, label: value });
      }
    })();
  }, [value, returnField]);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={selected}
      onChange={(opt) => { setSelected(opt || null); onChange?.(opt?.value || ''); }}
      placeholder={placeholder}
      isClearable={isClearable}
      styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}

function ProductPicker({ value, onChange, placeholder = 'Seleciona produto…', category }) {
  const cacheRef = useRef(new Map());
  const loadOptions = async (inputValue) => {
    const key = `${category || 'ALL'}::${inputValue || ''}`;
    if (cacheRef.current.has(key)) return cacheRef.current.get(key);
    const params = {};
    if (inputValue) params.q = inputValue;
    if (category) params.category = category;
    const res = await axios.get('/api/products', { params });
    const list = res.data?.data || [];
    const groupsMap = new Map();
    list.forEach((p) => {
      const catName = p.wl_category?.wl_name || 'Sem categoria';
      if (!groupsMap.has(catName)) groupsMap.set(catName, []);
      groupsMap.get(catName).push({ value: p._id, label: p.wl_name });
    });
    const grouped = Array.from(groupsMap.entries()).map(([label, options]) => ({ label, options }));
    cacheRef.current.set(key, grouped);
    return grouped;
  };

  const [selected, setSelected] = useState(null);
  useEffect(() => {
    let mounted = true;
    if (!value) { setSelected(null); return; }
    (async () => {
      try {
        const r = await axios.get(`/api/products/${value}`);
        if (!mounted) return;
        const p = r.data?.data;
        if (p) setSelected({ value, label: p.wl_name });
      } catch {
        setSelected(null);
      }
    })();
    return () => { mounted = false; };
  }, [value]);

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadOptions}
      value={selected}
      onChange={(opt) => { setSelected(opt); onChange?.(opt?.value || ''); }}
      placeholder={placeholder}
      isClearable
      styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
    />
  );
}

/* ------------------------------ IMAGES PREVIEW ---------------------------- */
function ImagesPreviewGrid({ files, onRemove }) {
  if (!files?.length) return null;
  return (
    <Row className="g-3">
      {files.map((f, idx) => {
        const url = typeof f === 'string' ? (f.startsWith('http') ? f : API_BASE + f) : URL.createObjectURL(f);
        return (
          <Col key={idx} xs={6} md={4} lg={3}>
            <div className="border rounded-3 shadow-sm p-2 h-100 d-flex flex-column">
              <Ratio aspectRatio="1x1" className="rounded overflow-hidden">
                <img src={url} alt={`img-${idx}`} className="w-100 h-100 object-fit-cover" />
              </Ratio>
              <Button variant="outline-danger" size="sm" className="mt-2" onClick={() => onRemove?.(idx)}>Remover</Button>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

/* --------------------------------- PRODUTOS ------------------------------- */
function ProductsTab() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const res = await axios.get('/api/products', {
      params: { q: query || undefined, category: category || undefined },
    });
    setItems(res.data.data || []);
    setLoading(false);
  };
  useEffect(() => { fetchList(); }, []);

  // CREATE
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    specs_text: '',
    description_html: '',
    datasheet_url: '',
    manual_url: '',
    sku: '',
  });
  const [files, setFiles] = useState([]);
  const onPickFiles = (e) => setFiles((prev) => [...prev, ...[...e.target.files]]);
  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleCreate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v !== '' && fd.append(k, v));
    for (const f of files) fd.append('images', f);
    await axios.post('/api/products', fd /* sem headers: deixa o browser definir */);
    setShowCreate(false);
    setForm({ name: '', category: '', specs_text: '', description_html: '', datasheet_url: '', manual_url: '', sku: '' });
    setFiles([]);
    fetchList();
  };

  // UPDATE
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    specs_text: '',
    description_html: '',
    datasheet_url: '',
    manual_url: '',
    sku: '',
  });
  const [editFiles, setEditFiles] = useState([]);
  const [existingImgs, setExistingImgs] = useState([]); // strings (paths)
  const [removingIdx, setRemovingIdx] = useState(null); // idx da imagem a remover
  const [removeErr, setRemoveErr] = useState('');

  const openEdit = (row) => {
    const p = row.original;
    setEditId(p._id);
    setEditForm({
      name: p.wl_name || '',
      category: p.wl_category?._id || p.wl_category || '',
      specs_text: p.wl_specs_text || '',
      description_html: p.wl_description_html || '',
      datasheet_url: p.wl_datasheet_url || '',
      manual_url: p.wl_manual_url || '',
      sku: p.wl_sku || '',
    });
    setExistingImgs(p.wl_images || []);
    setEditFiles([]);
    setRemoveErr('');
    setShowEdit(true);
  };

  const onPickEditFiles = (e) => setEditFiles((prev) => [...prev, ...[...e.target.files]]);
  const removeEditFile = (idx) => setEditFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => v !== '' && fd.append(k, v));
    for (const f of editFiles) fd.append('images', f); // backend concatena
    await axios.put(`/api/products/${editId}`, fd /* sem headers: deixa o browser definir */);
    setShowEdit(false);
    fetchList();
  };

  // Remover imagem existente (via novo endpoint)
  const removeExistingImage = async (idx) => {
    const src = existingImgs[idx];
    if (!src) return;
    setRemoveErr('');
    setRemovingIdx(idx);
    try {
      // usa querystring "src" (o backend aceita src OU index)
      await axios.delete(`/api/products/${editId}/images`, {
        params: { src }, // poderia ser { index: idx } se preferires
      });
      // atualiza a lista localmente
      setExistingImgs((prev) => prev.filter((_, i) => i !== idx));
    } catch (e) {
      setRemoveErr(e?.response?.data?.error || e.message || 'Falha ao remover a imagem');
    } finally {
      setRemovingIdx(null);
    }
  };

  // LIKE / UNLIKE
  const like = async (id) => {
    const r = await axios.post(`/api/products/${id}/like`);
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, wl_likes: r.data.data.likes } : p)));
  };
  const unlike = async (id) => {
    const r = await axios.post(`/api/products/${id}/unlike`);
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, wl_likes: r.data.data.likes } : p)));
  };

  // DELETE (com confirmação)
  const [confirm, setConfirm] = useState({ show: false, id: '', loading: false });
  const askDelete = (id) => setConfirm({ show: true, id, loading: false });
  const doDelete = async () => {
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await axios.delete(`/api/products/${confirm.id}`);
      setConfirm({ show: false, id: '', loading: false });
      fetchList();
    } catch {
      setConfirm({ show: false, id: '', loading: false });
    }
  };

  // Columns
  const columns = useMemo(
    () => [
      { accessorKey: 'wl_name', header: () => 'Nome', cell: (info) => <span className="fw-semibold">{info.getValue()}</span> },
      { accessorKey: 'wl_category', header: () => 'Categoria', cell: ({ row }) => <Badge bg="light" text="dark">{row.original?.wl_category?.wl_name || row.original?.wl_category || '—'}</Badge> },
      { accessorKey: 'wl_sku', header: () => 'SKU', cell: (info) => info.getValue() || '—' },
      {
        accessorKey: 'wl_likes',
        header: () => 'Likes',
        cell: ({ row }) => (
          <div className="d-flex align-items-center gap-2">
            <Badge bg="success">{row.original?.wl_likes || 0}</Badge>
            <Button size="sm" variant="outline-success" onClick={() => like(row.original._id)}><FiHeart /></Button>
            <Button size="sm" variant="outline-secondary" onClick={() => unlike(row.original._id)}><FaRegHeart /></Button>
          </div>
        ),
      },
      {
        accessorKey: 'wl_images',
        header: () => 'Imagens',
        cell: ({ row }) => {
          const imgs = (row.original?.wl_images || []).slice(0, 3);
          if (!imgs.length) return '—';
          return (
            <div className="d-flex align-items-center">
              {imgs.map((u, i) => (
                <img
                  key={i}
                  src={u.startsWith('http') ? u : API_BASE + u}
                  alt=""
                  className="rounded me-2"
                  style={{ height: 36, width: 36, objectFit: 'cover', border: '1px solid #eee' }}
                />
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: () => 'Ações',
        cell: ({ row }) => (
          <div className="hstack gap-2 justify-content-end">
            <Link to={`/products/${row.original._id}`} className="avatar-text avatar-md" title="Ver"><FiEye /></Link>
            <Button variant="outline-primary" size="sm" onClick={() => openEdit(row)} title="Editar"><FiEdit3 /></Button>
            <Dropdown
              dropdownItems={[
                { label: 'Eliminar', icon: <FiTrash2 />, onClick: () => askDelete(row.original._id) },
              ]}
              triggerIcon={<FiMoreHorizontal />}
              triggerClass="avatar-md"
              triggerPosition={'0,21'}
            />
          </div>
        ),
        meta: { headerClassName: 'text-end' },
      },
    ],
    []
  );

  return (
    <div>
      {/* Filtros */}
      <div className="d-flex flex-wrap gap-3 align-items-end mb-3">
        <div style={{ minWidth: 260, flex: 1 }}> 
        </div> 
        <Button className="ms-auto" onClick={() => setShowCreate(true)}>
          <FiPlus className="me-1" /> Novo Produto
        </Button>
      </div>

      {loading ? <Spinner /> : <Table data={items} columns={columns} />}

      {/* Criar */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="lg">
        <Form onSubmit={handleCreate}>
          <Modal.Header closeButton><Modal.Title>Novo Produto</Modal.Title></Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label>Nome</Form.Label><Form.Control required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Categoria</Form.Label><CategorySelect value={form.category} onChange={(val) => setForm({ ...form, category: val })} placeholder="Seleciona categoria…" /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Specs (texto)</Form.Label><Form.Control as="textarea" rows={2} value={form.specs_text} onChange={(e) => setForm({ ...form, specs_text: e.target.value })} /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Descrição (HTML)</Form.Label><Form.Control as="textarea" rows={3} value={form.description_html} onChange={(e) => setForm({ ...form, description_html: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Datasheet URL</Form.Label><Form.Control value={form.datasheet_url} onChange={(e) => setForm({ ...form, datasheet_url: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Manual URL</Form.Label><Form.Control value={form.manual_url} onChange={(e) => setForm({ ...form, manual_url: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>SKU</Form.Label><Form.Control value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Imagens</Form.Label><Form.Control type="file" multiple accept="image/*" onChange={onPickFiles} /><small className="text-muted">Podes selecionar várias.</small></Form.Group></Col>
              <Col md={12}><ImagesPreviewGrid files={files} onRemove={removeFile} /></Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Editar */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
        <Form onSubmit={handleUpdate}>
          <Modal.Header closeButton><Modal.Title>Editar Produto</Modal.Title></Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}><Form.Group><Form.Label>Nome</Form.Label><Form.Control required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Categoria</Form.Label><CategorySelect value={editForm.category} onChange={(val) => setEditForm({ ...editForm, category: val })} placeholder="Seleciona categoria…" /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Specs (texto)</Form.Label><Form.Control as="textarea" rows={2} value={editForm.specs_text} onChange={(e) => setEditForm({ ...editForm, specs_text: e.target.value })} /></Form.Group></Col>
              <Col md={12}><Form.Group><Form.Label>Descrição (HTML)</Form.Label><Form.Control as="textarea" rows={3} value={editForm.description_html} onChange={(e) => setEditForm({ ...editForm, description_html: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Datasheet URL</Form.Label><Form.Control value={editForm.datasheet_url} onChange={(e) => setEditForm({ ...editForm, datasheet_url: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Manual URL</Form.Label><Form.Control value={editForm.manual_url} onChange={(e) => setEditForm({ ...editForm, manual_url: e.target.value })} /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>SKU</Form.Label><Form.Control value={editForm.sku} onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })} /></Form.Group></Col>

              {/* Imagens existentes + remover */}
              <Col md={12}>
                <Form.Label>Imagens existentes</Form.Label>
                {removeErr && <div className="text-danger small mb-2">{removeErr}</div>}
                {!existingImgs?.length ? (
                  <div className="text-muted">Sem imagens.</div>
                ) : (
                  <Row className="g-3">
                    {existingImgs.map((u, i) => {
                      const url = u.startsWith('http') ? u : API_BASE + u;
                      const busy = removingIdx === i;
                      return (
                        <Col key={i} xs={6} md={4} lg={3}>
                          <div className="border rounded-3 p-2 h-100 d-flex flex-column">
                            <Ratio aspectRatio="1x1" className="rounded overflow-hidden">
                              <img src={url} alt={`img-${i}`} className="w-100 h-100 object-fit-cover" />
                            </Ratio>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="mt-2"
                              disabled={busy}
                              onClick={() => removeExistingImage(i)}
                            >
                              {busy ? 'A remover…' : (<><FiTrash2 className="me-1" /> Remover</>)}
                            </Button>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                )}
                <small className="text-muted d-block mt-1">
                  Podes remover imagens individualmente. As novas imagens anexadas abaixo serão adicionadas.
                </small>
              </Col>

              <Col md={12}>
                <Form.Group className="mt-2">
                  <Form.Label>Adicionar novas imagens</Form.Label>
                  <Form.Control type="file" multiple accept="image/*" onChange={onPickEditFiles} />
                </Form.Group>
                <div className="mt-2"><ImagesPreviewGrid files={editFiles} onRemove={removeEditFile} /></div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button type="submit">Atualizar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Confirm Delete (produto) */}
      <ConfirmDialog
        show={confirm.show}
        title="Eliminar produto"
        body="Tens a certeza que queres eliminar este produto? Esta ação é irreversível."
        confirmText="Eliminar"
        onCancel={() => setConfirm({ show: false, id: '', loading: false })}
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </div>
  );
}

/* --------------------------- DESTAQUES HOME (4) --------------------------- */
function FeaturedHomeTab() {
  const { data, loading, error, reload } = useFetch(async () => {
    const r = await axios.get('/api/featured/home');
    return r.data.data || { wl_slots: [] };
  }, []);

  const [slots, setSlots] = useState(['', '', '', '']);
  useEffect(() => {
    if (!data) return;
    const vals = [0, 1, 2, 3].map((i) => {
      const p = (data.wl_slots || [])[i];
      return typeof p === 'string' ? p : p?._id || '';
    });
    setSlots(vals);
  }, [data]);

  const setSlot = (i, val) => setSlots((s) => { const copy = [...s]; copy[i] = val; return copy; });
  const save = async () => { const clean = slots.filter(Boolean); await axios.put('/api/featured/home', { slots: clean }); reload(); };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  const rows = (data?.wl_slots || []).map((p, i) => ({ idx: i + 1, name: typeof p === 'string' ? p : p?.wl_name }));
  const columns = [
    { accessorKey: 'idx', header: () => '#', cell: (info) => info.getValue() },
    { accessorKey: 'name', header: () => 'Produto', cell: (info) => info.getValue() || '—' },
  ];

  return (
    <div>
      <p className="text-muted">Seleciona até 4 produtos (por ordem).</p>
      <Row className="g-3">
        {[0, 1, 2, 3].map((i) => (
          <Col md={6} key={i}>
            <Form.Label>Slot {i + 1}</Form.Label>
            <ProductPicker value={slots[i]} onChange={(id) => setSlot(i, id)} placeholder={`Produto para slot ${i + 1}`} />
          </Col>
        ))}
      </Row>
      <Button className="mt-3" onClick={save}>Guardar</Button>
      <div className="mt-4"><Table data={rows} columns={columns} /></div>
    </div>
  );
}

/* ---------------------------- DESTAQUES (LISTA) --------------------------- */
 
function FeaturedListTab() {
  const { data, reload } = useFetch(
    async () => (await axios.get("/api/featured")).data?.data || [],
    []
  );

  const items = data || [];
  const [productId, setProductId] = useState("");
  const [order, setOrder] = useState(0);

  const add = async () => {
    if (!productId) {
      toast.error("Seleciona um produto primeiro.");
      return;
    }
    await toast.promise(
      axios.post("/api/featured", {
        productId,
        order: Number(order) || 0,
      }),
      {
        loading: "A adicionar destaque…",
        success: "Produto adicionado aos destaques!",
        error: "Falha ao adicionar destaque.",
      }
    );
    setProductId("");
    setOrder(0);
    reload();
  };

  const [confirm, setConfirm] = useState({
    show: false,
    id: "",
    loading: false,
  });

  const askDelete = (pid) =>
    setConfirm({ show: true, id: pid, loading: false });

  const doDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await toast.promise(axios.delete(`/api/featured/${confirm.id}`), {
        loading: "A remover…",
        success: "Destaque removido.",
        error: "Não foi possível remover.",
      });
      setConfirm({ show: false, id: "", loading: false });
      reload();
    } catch {
      setConfirm({ show: false, id: "", loading: false });
    }
  };

  const columns = [
    {
      accessorKey: "wl_product",
      header: () => "Produto",
      cell: ({ row }) =>
        row.original?.wl_product?.wl_name ||
        row.original?.wl_product ||
        "—",
    },
    { accessorKey: "wl_order", header: () => "Ordem" },
    {
      accessorKey: "actions",
      header: () => "",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() =>
            askDelete(row.original?.wl_product?._id || row.original?.wl_product)
          }
        >
          Remover
        </Button>
      ),
      meta: { headerClassName: "text-end" },
    },
  ];

  return (
    <div>
      <Toaster position="top-right" />
      <Row className="g-2 align-items-end">
        <Col md={6}>
          <Form.Label>Produto</Form.Label>
          <ProductPicker
            value={productId}
            onChange={setProductId}
            placeholder="Pesquisar produto…"
          />
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Ordem</Form.Label>
            <Form.Control
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button onClick={add} disabled={!productId}>
            + Adicionar
          </Button>
        </Col>
      </Row>

      <div className="mt-3">
        <Table data={items} columns={columns} />
      </div>

      <ConfirmDialog
        show={confirm.show}
        title="Remover destaque"
        body="Queres mesmo remover este produto dos destaques?"
        confirmText="Remover"
        onCancel={() =>
          setConfirm({ show: false, id: "", loading: false })
        }
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </div>
  );
}


/* ------------------------------- TOP OVERALL ------------------------------ */
function TopOverallTab() {
  const { data, reload } = useFetch(
    async () => (await axios.get("/api/top/overall")).data.data,
    []
  );

  const [top10, setTop10] = useState([]);
  const [best, setBest] = useState("");

  useEffect(() => {
    if (data) {
      setTop10((data.wl_top10 || []).map((x) => (typeof x === "string" ? x : x?._id)));
      setBest(data.wl_best?._id || data.wl_best || "");
    }
  }, [data]);

  const setTopItem = (idx, val) =>
    setTop10((prev) => {
      const cp = [...prev];
      cp[idx] = val || "";
      return cp;
    });

  const addTopItem = () =>
    setTop10((prev) => (prev.length < 10 ? [...prev, ""] : prev));

  const removeTopItem = (idx) =>
    setTop10((prev) => prev.filter((_, i) => i !== idx));

  const save = async () => {
    await toast.promise(
      axios.put("/api/top/overall", {
        top10: top10.filter(Boolean),
        best: best || undefined,
      }),
      {
        loading: "A guardar…",
        success: "Top Overall atualizado!",
        error: "Falha ao guardar Top Overall.",
      }
    );
    reload();
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Form.Label>Melhor produto</Form.Label>
      <ProductPicker
        value={best}
        onChange={setBest}
        placeholder="Seleciona o melhor produto…"
      />
      <div className="mt-3 d-flex align-items-center justify-content-between">
        <h6 className="mb-0">Top 10</h6>
        <Button size="sm" onClick={addTopItem} disabled={top10.length >= 10}>
          + adicionar
        </Button>
      </div>
      <Row className="g-2 mt-1">
        {top10.map((id, i) => (
          <Col md={6} key={i}>
            <InputGroup>
              <div className="input-group-text">#{i + 1}</div>
              <div className="flex-grow-1">
                <ProductPicker
                  value={id}
                  onChange={(v) => setTopItem(i, v)}
                  placeholder={`Produto posição ${i + 1}`}
                />
              </div>
              <Button variant="outline-danger" onClick={() => removeTopItem(i)}>
                –
              </Button>
            </InputGroup>
          </Col>
        ))}
      </Row>
      <div className="mt-3">
        <Button onClick={save}>Guardar</Button>
      </div>
    </div>
  );
}


/* ----------------------------- TOP BY CATEGORY ---------------------------- */
function TopByCategoryTab() {
  const [categoryName, setCategoryName] = useState("");

  const { data, reload } = useFetch(
    async () => {
      if (!categoryName) return { wl_top3: [], wl_top10: [], wl_best: "" };
      return (await axios.get(`/api/top/category/${encodeURIComponent(categoryName)}`)).data.data;
    },
    [categoryName]
  );

  const [top3, setTop3] = useState([]);
  const [top10, setTop10] = useState([]);
  const [best, setBest] = useState("");

  useEffect(() => {
    if (!data) return;
    setTop3((data.wl_top3 || []).map((x) => x?._id || x));
    setTop10((data.wl_top10 || []).map((x) => x?._id || x));
    setBest(data.wl_best?._id || data.wl_best || "");
  }, [data]);

  const setTop3Item = (i, v) =>
    setTop3((p) => {
      const c = [...p];
      c[i] = v || "";
      return c;
    });

  const setTop10Item = (i, v) =>
    setTop10((p) => {
      const c = [...p];
      c[i] = v || "";
      return c;
    });

  const save = async () => {
    if (!categoryName) {
      toast.error("Seleciona uma categoria.");
      return;
    }
    await toast.promise(
      axios.put(`/api/top/category/${encodeURIComponent(categoryName)}`, {
        top3: top3.filter(Boolean),
        top10: top10.filter(Boolean),
        best: best || undefined,
      }),
      {
        loading: "A guardar…",
        success: "Top por categoria atualizado!",
        error: "Falha ao guardar Top por categoria.",
      }
    );
    reload();
  };

  return (
    <div>
      <Toaster position="top-right" />

      <Form.Group className="mb-3">
        <Form.Label>Categoria</Form.Label>
        <CategorySelect
          value={categoryName}
          onChange={setCategoryName}
          placeholder="Seleciona categoria…"
          returnField="name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Melhor produto</Form.Label>
        <ProductPicker
          value={best}
          onChange={setBest}
          placeholder="Seleciona o melhor produto da categoria…"
        />
      </Form.Group>

      <Row className="g-3">
        <Col md={6}>
          <h6>Top 3</h6>
          {[0, 1, 2].map((i) => (
            <div className="mb-2" key={i}>
              <InputGroup>
                <div className="input-group-text">#{i + 1}</div>
                <div className="flex-grow-1">
                  <ProductPicker
                    value={top3[i] || ""}
                    onChange={(v) => setTop3Item(i, v)}
                    placeholder={`Produto Top3 posição ${i + 1}`}
                    category={undefined}
                  />
                </div>
              </InputGroup>
            </div>
          ))}
        </Col>
        <Col md={6}>
          <h6>Top 10</h6>
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="mb-2" key={i}>
              <InputGroup>
                <div className="input-group-text">#{i + 1}</div>
                <div className="flex-grow-1">
                  <ProductPicker
                    value={top10[i] || ""}
                    onChange={(v) => setTop10Item(i, v)}
                    placeholder={`Produto Top10 posição ${i + 1}`}
                  />
                </div>
              </InputGroup>
            </div>
          ))}
        </Col>
      </Row>

      <div className="mt-3">
        <Button onClick={save} disabled={!categoryName}>
          Guardar
        </Button>
      </div>
    </div>
  );
}


/* ----------------------------- CASOS DE SUCESSO --------------------------- */
 function SuccessCasesTab() {
  const { data, reload } = useFetch(
    async () => (await axios.get("/api/success-cases")).data?.data || [],
    []
  );
  const items = data || [];

  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    title: "",
    description_html: "",
  });
  const [files, setFiles] = useState([]);

  const create = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    for (const f of files) fd.append("images", f);

    await toast.promise(axios.post("/api/success-cases", fd), {
      loading: "A criar caso…",
      success: "Caso de sucesso criado!",
      error: "Falha ao criar caso.",
    });

    setShow(false);
    setForm({ company_name: "", title: "", description_html: "" });
    setFiles([]);
    reload();
  };

  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({
    company_name: "",
    title: "",
    description_html: "",
  });
  const [editFiles, setEditFiles] = useState([]);
  const [existingImgs, setExistingImgs] = useState([]);

  const openEdit = (row) => {
    const c = row.original;
    setEditId(c._id);
    setEditForm({
      company_name: c.wl_company_name || "",
      title: c.wl_title || "",
      description_html: c.wl_description_html || "",
    });
    setExistingImgs(c.wl_images || []);
    setEditFiles([]);
    setShowEdit(true);
  };

  const onPickEditFiles = (e) =>
    setEditFiles((prev) => [...prev, ...[...e.target.files]]);
  const removeEditFile = (idx) =>
    setEditFiles((prev) => prev.filter((_, i) => i !== idx));

  const update = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
    for (const f of editFiles) fd.append("images", f);

    await toast.promise(
      axios.put(`/api/success-cases/${editId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      {
        loading: "A atualizar…",
        success: "Caso de sucesso atualizado!",
        error: "Falha ao atualizar caso.",
      }
    );
    setShowEdit(false);
    reload();
  };

  const [confirm, setConfirm] = useState({
    show: false,
    id: "",
    loading: false,
  });

  const askDelete = (id) =>
    setConfirm({ show: true, id, loading: false });

  const doDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await toast.promise(axios.delete(`/api/success-cases/${confirm.id}`), {
        loading: "A eliminar…",
        success: "Caso eliminado.",
        error: "Não foi possível eliminar.",
      });
      setConfirm({ show: false, id: "", loading: false });
      reload();
    } catch {
      setConfirm({ show: false, id: "", loading: false });
    }
  };

  const columns = [
    { accessorKey: "wl_company_name", header: () => "Empresa" },
    { accessorKey: "wl_title", header: () => "Título" },
    {
      accessorKey: "wl_images",
      header: () => "Imagens",
      cell: ({ row }) => (row.original?.wl_images || []).length || 0,
    },
    {
      accessorKey: "actions",
      header: () => "",
      cell: ({ row }) => (
        <div className="hstack gap-2 justify-content-end">
          <Button size="sm" variant="outline-primary" onClick={() => openEdit(row)}>
            <FiEdit3 className="me-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => askDelete(row.original._id)}
          >
            <FiTrash2 className="me-1" />
            Eliminar
          </Button>
        </div>
      ),
      meta: { headerClassName: "text-end" },
    },
  ];

  return (
    <div>
      <Toaster position="top-right" />
      <Button onClick={() => setShow(true)}>
        <FiPlus className="me-1" /> Novo Caso
      </Button>

      <div className="mt-3">
        <Table data={items} columns={columns} />
      </div>

      {/* Criar */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Form onSubmit={create}>
          <Modal.Header closeButton>
            <Modal.Title>Novo Caso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Empresa</Form.Label>
              <Form.Control
                required
                value={form.company_name}
                onChange={(e) =>
                  setForm({ ...form, company_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Título</Form.Label>
              <Form.Control
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrição (HTML)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description_html}
                onChange={(e) =>
                  setForm({ ...form, description_html: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Imagens</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles([...e.target.files])}
              />
            </Form.Group>
            <ImagesPreviewGrid
              files={files}
              onRemove={(i) =>
                setFiles((prev) => prev.filter((_, idx) => idx !== i))
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Editar */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
        <Form onSubmit={update}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Caso de Sucesso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Empresa</Form.Label>
              <Form.Control
                required
                value={editForm.company_name}
                onChange={(e) =>
                  setEditForm({ ...editForm, company_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Título</Form.Label>
              <Form.Control
                required
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Descrição (HTML)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description_html}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description_html: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Label className="mt-2">Imagens existentes</Form.Label>
            <ImagesPreviewGrid
              files={existingImgs}
              onRemove={() => {
                /* remoção requer endpoint dedicado */
              }}
            />
            <small className="text-muted d-block mt-1">
              Nota: ao atualizar, novas imagens são anexadas. Para remover, é
              necessário um endpoint de remoção.
            </small>

            <Form.Group className="mt-3">
              <Form.Label>Adicionar novas imagens</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={onPickEditFiles}
              />
            </Form.Group>
            <div className="mt-2">
              <ImagesPreviewGrid
                files={editFiles}
                onRemove={removeEditFile}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancelar
            </Button>
            <Button type="submit">Atualizar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Confirmar Delete */}
      <ConfirmDialog
        show={confirm.show}
        title="Eliminar caso"
        body="Tens a certeza que queres eliminar este caso de sucesso?"
        confirmText="Eliminar"
        onCancel={() =>
          setConfirm({ show: false, id: "", loading: false })
        }
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </div>
  );
}


/* --------------------------------- MENSAGENS ------------------------------ */
  function MessagesTab() {
  const [decrypt, setDecrypt] = useState(true);
  const { data, reload } = useFetch(
    async () =>
      (await axios.get(`/api/messages${decrypt ? "?decrypt=1" : ""}`)).data
        .data || [],
    [decrypt]
  );

  const items = data || [];

  const columns = [
    {
      accessorKey: "created",
      header: () => "Data",
      cell: ({ row }) =>
        new Date(
          row.original.created_at || row.original.wl_created_at
        ).toLocaleString(),
    },
    {
      accessorKey: "source",
      header: () => "Origem",
      cell: ({ row }) => <Badge bg="info">{row.original.source || "—"}</Badge>,
    },
    {
      accessorKey: "payload.nome",
      header: () => "Nome",
      cell: ({ row }) => row.original?.payload?.nome || "—",
    },
    {
      accessorKey: "payload.email",
      header: () => "Email",
      cell: ({ row }) => row.original?.payload?.email || "—",
    },
    {
      accessorKey: "payload.tipo",
      header: () => "Tipo",
      cell: ({ row }) => row.original?.payload?.tipo || "—",
    },
    {
      accessorKey: "payload.mensagem",
      header: () => "Mensagem",
      cell: ({ row }) => (
        <span
          className="text-truncate d-inline-block"
          style={{ maxWidth: 260 }}
          title={row.original?.payload?.mensagem || "—"}
        >
          {row.original?.payload?.mensagem || "—"}
        </span>
      ),
    },
  ];

  const handleReload = async () => {
    await toast.promise(
      (async () => {
        await reload();
      })(),
      {
        loading: "A recarregar…",
        success: "Mensagens atualizadas.",
        error: "Não foi possível recarregar.",
      }
    );
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Form.Check
        type="switch"
        id="dec"
        label="Mostrar dados desencriptados"
        checked={decrypt}
        onChange={(e) => setDecrypt(e.target.checked)}
      />
      <div className="mt-3">
        <Table data={items} columns={columns} />
      </div>
      <Button variant="outline-secondary" onClick={handleReload} className="mt-2">
        Recarregar
      </Button>
    </div>
  );
}
 
/* --------------------------------- USERS ---------------------------------- */
  function UsersTab() {
  const { data, reload } = useFetch(
    async () => (await axios.get("/api/users")).data?.data || [],
    []
  );

  const users = data || [];
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer",
  });

  const createUser = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Preenche todos os campos obrigatórios.");
      return;
    }
    await toast.promise(
      axios.post("/api/auth/users", form),
      {
        loading: "A criar utilizador…",
        success: "Utilizador criado com sucesso!",
        error: (err) =>
          err?.response?.data?.error || "Falha ao criar utilizador.",
      }
    );
    setShow(false);
    setForm({ name: "", email: "", password: "", role: "viewer" });
    reload();
  };

  const columns = [
    { accessorKey: "wl_name", header: () => "Nome" },
    { accessorKey: "wl_email", header: () => "Email" },
    {
      accessorKey: "wl_role",
      header: () => "Role",
      cell: ({ row }) => <Badge bg="secondary">{row.original?.wl_role}</Badge>,
    },
  ];

  return (
    <div>
      <Toaster position="top-right" />
      <Button onClick={() => setShow(true)}>+ Novo Utilizador</Button>

      <div className="mt-3">
        <Table data={users} columns={columns} />
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Form onSubmit={createUser}>
          <Modal.Header closeButton>
            <Modal.Title>Novo Utilizador</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}


/* --------------------------------- TOP LIKED ------------------------------ */
 function TopLikedTab() {
  const { data, reload } = useFetch(
    async () => (await axios.get("/api/products/top-liked")).data?.data || [],
    []
  );

  const items = data || [];

  const columns = [
    {
      accessorKey: "idx",
      header: () => "#",
      cell: ({ row }) => row.index + 1,
      meta: { headerClassName: "width-30" },
    },
    { accessorKey: "wl_name", header: () => "Produto" },
    { accessorKey: "wl_likes", header: () => "Likes" },
  ];

  const handleReload = async () => {
    await toast.promise(
      (async () => {
        await reload();
      })(),
      {
        loading: "A recarregar…",
        success: "Lista atualizada!",
        error: "Não foi possível recarregar.",
      }
    );
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Table data={items} columns={columns} />
      <Button variant="outline-secondary" onClick={handleReload} className="mt-2">
        Recarregar
      </Button>
    </div>
  );
}

/* -------------------------- CUSTOMIZAÇÃO – NOVO --------------------------- */
function CustomizationSection() {
  const [categoryId, setCategoryId] = useState('');
  const [productId, setProductId] = useState('');

  return (
    <Card className="border-0">
      <Card.Body className="p-4">
        <Tabs defaultActiveKey="examples" className="mb-3">
          <Tab eventKey="examples" title={<span><FiGrid className="me-1" /> Exemplares</span>}>
            <ExamplesTab categoryId={categoryId} setCategoryId={setCategoryId} productId={productId} setProductId={setProductId} />
          </Tab>
          <Tab eventKey="catstyle" title={<span><FiVideo className="me-1" /> Categoria (vídeo/estilo)</span>}>
            <CategoryVideoStyleTab categoryId={categoryId} setCategoryId={setCategoryId} />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
}

/* -------------------------- Exemplares (galeria) --------------------------- */
  

function ExamplesTab({ categoryId, setCategoryId, productId, setProductId }) {
  const params = {};
  if (categoryId) params.categoryId = categoryId;
  if (productId) params.productId = productId;

  const { data, loading, error, reload } = useFetch(async () => {
    const r = await axios.get("/api/examples", { params });
    return r.data?.data || [];
  }, [categoryId, productId]);

  const items = data || [];

  // ---- Criação (mantive, mas mudei descrição para textarea) -----------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [imagePath, setImagePath] = useState(""); // ex.: "/uploads/xyz.jpg"
  const [fileToUpload, setFileToUpload] = useState(null);

  const onPickFile = async (e) => {
    const file = e.target.files?.[0] || null;
    setFileToUpload(file);
    setImagePath("");

    if (!file) return;

    await toast.promise(
      (async () => {
        const fd = new FormData();
        fd.append("file", file);
        const r = await axios.post("/api/upload", fd);
        const path =
          r?.data?.path ||
          r?.data?.data?.path ||
          r?.data?.file?.path ||
          "";
        if (!path) {
          throw new Error('Upload concluído mas sem "path" no retorno.');
        }
        setImagePath(path);
      })(),
      {
        loading: "A enviar imagem…",
        success: "Imagem enviada!",
        error: (err) => err?.message || "Falha no upload.",
      }
    );
  };

  const addExample = async () => {
    if (!title || !imagePath || !(categoryId || productId)) {
      toast.error("Preenche título, imagem e pelo menos categoria ou produto.");
      return;
    }
    await toast.promise(
      axios.post("/api/examples", {
        categoryId: categoryId || undefined,
        productId: productId || undefined,
        items: [{ title, description, image: imagePath }],
      }),
      {
        loading: "A criar exemplar…",
        success: "Exemplar criado!",
        error: "Falha ao criar exemplar.",
      }
    );
    setTitle("");
    setDescription("");
    setImagePath("");
    setFileToUpload(null);
    reload();
  };

  // ---- Remover --------------------------------------------------------------
  const [confirm, setConfirm] = useState({ show: false, id: "", loading: false });
  const askDelete = (id) => setConfirm({ show: true, id, loading: false });

  const doDelete = async () => {
    setConfirm((c) => ({ ...c, loading: true }));
    try {
      await toast.promise(axios.delete(`/api/examples/${confirm.id}`), {
        loading: "A eliminar…",
        success: "Exemplar removido.",
        error: "Não foi possível remover.",
      });
      setConfirm({ show: false, id: "", loading: false });
      reload();
    } catch {
      setConfirm({ show: false, id: "", loading: false });
    }
  };

  // ---- Edição inline no card -----------------------------------------------
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    title: "",
    description: "",
    image: "",
    uploading: false,
  });

  const startEdit = (it) => {
    setEditingId(it._id);
    setEditDraft({
      title: it.title || "",
      description: it.description || "",
      image: it.image || "",
      uploading: false,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ title: "", description: "", image: "", uploading: false });
  };

  const onPickEditFile = async (e) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    setEditDraft((d) => ({ ...d, uploading: true }));

    try {
      await toast.promise(
        (async () => {
          const fd = new FormData();
          fd.append("file", file);
          const r = await axios.post("/api/upload", fd);
          const path =
            r?.data?.path ||
            r?.data?.data?.path ||
            r?.data?.file?.path ||
            "";
          if (!path) throw new Error('Upload concluído mas sem "path" no retorno.');
          setEditDraft((d) => ({ ...d, image: path }));
        })(),
        {
          loading: "A enviar nova imagem…",
          success: "Nova imagem carregada!",
          error: (err) => err?.message || "Falha no upload.",
        }
      );
    } finally {
      setEditDraft((d) => ({ ...d, uploading: false }));
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const payload = {};
    if (typeof editDraft.title === "string") payload.title = editDraft.title;
    if (typeof editDraft.description === "string") payload.description = editDraft.description;
    if (typeof editDraft.image === "string" && editDraft.image) payload.image = editDraft.image;

    if (Object.keys(payload).length === 0) {
      toast.error("Nada para atualizar.");
      return;
    }

    await toast.promise(
      axios.patch(`/api/examples/${editingId}`, payload),
      {
        loading: "A guardar alterações…",
        success: "Exemplar atualizado!",
        error: (err) => err?.response?.data?.error || "Falha ao atualizar.",
      }
    );

    cancelEdit();
    reload();
  };

  const canCreate = Boolean(title && imagePath && (categoryId || productId));

  return (
    <div>
      <Toaster position="top-right" />

      <Row className="g-3 align-items-end">
        <Col md={6}>
          <Form.Label>Categoria</Form.Label>
          <CategorySelect
            value={categoryId}
            onChange={setCategoryId}
            placeholder="Seleciona categoria…"
          />
        </Col>
        <Col md={6}>
          <Form.Label>Produto (opcional)</Form.Label>
          <ProductPicker
            value={productId}
            onChange={setProductId}
            placeholder="Filtrar por produto…"
            category={categoryId}
          />
        </Col>
      </Row>

      <Card className="mt-3">
        <Card.Header className="bg-white">
          <FiFolderPlus className="me-2" />
          Adicionar exemplar
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Título</Form.Label>
                <Form.Control
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Estádio Municipal – Instalação A"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descrição…"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Imagem</Form.Label>
                <InputGroup>
                  <Form.Control type="file" accept="image/*" onChange={onPickFile} />
                  <InputGroup.Text>
                    {imagePath ? "OK" : fileToUpload ? "A enviar…" : "Por enviar"}
                  </InputGroup.Text>
                </InputGroup>

                {imagePath && (
                  <div className="mt-2 d-flex align-items-center gap-3">
                    <img
                      src={
                        imagePath.startsWith("http")
                          ? imagePath
                          : API_BASE + imagePath
                      }
                      alt="preview"
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #eee",
                      }}
                    />
                    <small className="text-success">{imagePath}</small>
                  </div>
                )}
              </Form.Group>
            </Col>

            <Col md={6} className="d-flex align-items-end">
              <Button disabled={!canCreate} onClick={addExample}>
                <FiPlus className="me-1" /> Adicionar exemplar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <h6 className="mt-4 mb-2">Galeria</h6>
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert variant="danger">{String(error)}</Alert>
      ) : items.length === 0 ? (
        <div className="text-muted">Sem exemplares para estes filtros.</div>
      ) : (
        <Row className="g-3">
          {items.map((it) => {
            const isEditing = editingId === it._id;
            return (
              <Col key={it._id} xs={12} sm={6} md={4} lg={3}>
                <Card className="h-100 shadow-sm">
                  <Ratio aspectRatio="1x1" className="rounded-top overflow-hidden">
                    <img
                      src={
                        (isEditing ? editDraft.image : it.image)?.startsWith?.("http")
                          ? (isEditing ? editDraft.image : it.image)
                          : API_BASE + (isEditing ? editDraft.image : it.image)
                      }
                      alt={it.title}
                      className="w-100 h-100 object-fit-cover"
                    />
                  </Ratio>

                  <Card.Body>
                    {!isEditing ? (
                      <>
                        <div className="fw-semibold text-truncate">{it.title}</div>
                        <div className="small text-muted">
                          {it.description || "—"}
                        </div>
                      </>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        <Form.Group>
                          <Form.Label>Título</Form.Label>
                          <Form.Control
                            value={editDraft.title}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, title: e.target.value }))
                            }
                            placeholder="Título do exemplar"
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Descrição</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={editDraft.description}
                            onChange={(e) =>
                              setEditDraft((d) => ({ ...d, description: e.target.value }))
                            }
                            placeholder="Descrição detalhada…"
                          />
                        </Form.Group>

                        <Form.Group>
                          <Form.Label>Imagem</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={onPickEditFile}
                              disabled={editDraft.uploading}
                            />
                            <InputGroup.Text>
                              {editDraft.uploading
                                ? "A enviar…"
                                : editDraft.image
                                ? "OK"
                                : "Por enviar"}
                            </InputGroup.Text>
                          </InputGroup>
                          {editDraft.image && (
                            <small className="text-success d-block mt-1">
                              {editDraft.image}
                            </small>
                          )}
                        </Form.Group>
                      </div>
                    )}
                  </Card.Body>

                  <Card.Footer className="bg-white d-flex justify-content-between">
                    {!isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => startEdit(it)}
                        >
                          <FiEdit3 className="me-1" /> Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => askDelete(it._id)}
                        >
                          <FiTrash2 className="me-1" /> Remover
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="success" onClick={saveEdit}>
                          <FiSave className="me-1" /> Salvar
                        </Button>
                        <Button size="sm" variant="outline-dark" onClick={cancelEdit}>
                           cancelar
                        </Button>
                      </>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <ConfirmDialog
        show={confirm.show}
        title="Eliminar exemplar"
        body="Queres mesmo eliminar este exemplar ?"
        confirmText="Eliminar"
        onCancel={() => setConfirm({ show: false, id: "", loading: false })}
        onConfirm={doDelete}
        loading={confirm.loading}
      />
    </div>
  );
}


 
/* ---------------------- Categoria: Vídeo + Estilo ------------------------- */
 function CategoryVideoStyleTab({ categoryId, setCategoryId }) {
  const [style, setStyle] = useState({ color: "#1e293b", subtitle: "" });
  const [video, setVideo] = useState({ videoUrl: "", videoText: "" });

  const { reload: reloadStyle } = useFetch(async () => {
    if (!categoryId) return {};
    const r = await axios.get(`/api/categories/${categoryId}/style`);
    const d = r.data?.data || {};
    setStyle({ color: d.color || "#1e293b", subtitle: d.subtitle || "" });
    return d;
  }, [categoryId]);

  const { reload: reloadVideo } = useFetch(async () => {
    if (!categoryId) return {};
    const r = await axios.get(`/api/categories/${categoryId}/video`);
    const d = r.data?.data || {};
    setVideo({ videoUrl: d.videoUrl || "", videoText: d.videoText || "" });
    return d;
  }, [categoryId]);

  const saveStyle = async () => {
    if (!categoryId) {
      toast.error("Seleciona uma categoria primeiro.");
      return;
    }
    await toast.promise(
      axios.put(`/api/categories/${categoryId}/style`, style),
      {
        loading: "A guardar estilo…",
        success: "Estilo atualizado!",
        error: "Falha ao guardar estilo.",
      }
    );
    reloadStyle();
  };

  const saveVideo = async () => {
    if (!categoryId) {
      toast.error("Seleciona uma categoria primeiro.");
      return;
    }
    await toast.promise(
      axios.put(`/api/categories/${categoryId}/video`, video),
      {
        loading: "A guardar vídeo…",
        success: "Vídeo atualizado!",
        error: "Falha ao guardar vídeo.",
      }
    );
    reloadVideo();
  };

  return (
    <div>
      <Toaster position="top-right" />

      <Row className="g-3">
        <Col md={6}>
          <Form.Label>Categoria</Form.Label>
          <CategorySelect
            value={categoryId}
            onChange={setCategoryId}
            placeholder="Seleciona categoria…"
          />
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-white">Estilo</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Cor</Form.Label>
                    <Form.Control
                      type="text"
                      value={style.color}
                      placeholder='Linear gradient'
                      onChange={(e) =>
                        setStyle({ ...style, color: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Subtítulo</Form.Label>
                    <Form.Control
                      value={style.subtitle}
                      onChange={(e) =>
                        setStyle({ ...style, subtitle: e.target.value })
                      }
                      placeholder="Texto breve"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button className="mt-3" onClick={saveStyle} disabled={!categoryId}>
                Guardar estilo
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header className="bg-white">
              <FiVideo className="me-2" />
              Vídeo
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>URL do vídeo (YouTube/Vimeo, etc.)</Form.Label>
                <Form.Control
                  value={video.videoUrl}
                  onChange={(e) =>
                    setVideo({ ...video, videoUrl: e.target.value })
                  }
                  placeholder="https://…"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Texto/Descrição (HTML permitido)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={video.videoText}
                  onChange={(e) =>
                    setVideo({ ...video, videoText: e.target.value })
                  }
                />
              </Form.Group>
              <Button className="mt-3" onClick={saveVideo} disabled={!categoryId}>
                Guardar vídeo
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {categoryId && (
        <Card className="mt-3">
          <Card.Header className="bg-white">Preview</Card.Header>
          <Card.Body>
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle"
                style={{ width: 28, height: 28, background: style.color }}
              />
              <div className="fw-semibold">Subtítulo:</div>
              <div className="text-muted">{style.subtitle || "—"}</div>
            </div>
            {video.videoUrl && (
              <div className="mt-3">
                <a href={video.videoUrl} target="_blank" rel="noreferrer">
                  Abrir vídeo
                </a>
              </div>
            )}
            {video.videoText && (
              <div
                className="mt-2 small text-muted"
                dangerouslySetInnerHTML={{ __html: video.videoText }}
              />
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
 
 
/* --------------------------------- API HELPERS ---------------------------------*/
const withHost = (u) => (u?.startsWith('http') ? u : (API_BASE + u));
const safe = (s, fb = '') => (typeof s === 'string' && s.trim() ? s : fb);
 
function SolutionsTab() {
  // ---------- listagem/seleção de soluções ----------
  const [q, setQ] = useState('');
  const { data, loading, error, reload } = useFetch(async () => {
    const r = await axios.get('/api/solutions', { params: { q: q || undefined } });
    return r.data?.data || [];
  }, [q]);
  const solutions = data || [];
  const [sel, setSel] = useState(null);

  useEffect(() => { if (!solutions?.length) setSel(null); }, [solutions]);

  // ---------- criar/editar solução ---------- 
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const doUpload = async () => {
    if (!file) { toast('Escolhe um ficheiro primeiro.', { icon: '💡' }); return; }
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const r = await axios.post('/api/upload', fd);
      const path = r.data?.path || '';
      setForm((f) => ({ ...f, image: path }));
      toast.success('Imagem enviada!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha no upload');
    } finally {
      setUploading(false);
    }
  };

  const createSolution = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/solutions', form);
      setShowCreate(false);
      setForm({ title: '', description: '', image: '' });
      setFile(null);
      toast.success('Solução criada!');
      reload();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao criar solução');
    }
  };

  const openEdit = (s) => {
    setSel(s);
    setForm({ title: s.title || '', description: s.description || '', image: s.image || '' });
    setFile(null);
    setShowEdit(true);
  };

  const updateSolution = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/solutions/${sel._id}`, form);
      setShowEdit(false);
      toast.success('Solução atualizada!');
      reload();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao atualizar solução');
    }
  };

  // ---------- eliminar ----------
  const [confirm, setConfirm] = useState({ show: false, id: '', loading: false });
  const askDelete = (id) => setConfirm({ show: true, id, loading: false });
  const doDelete = async () => {
    try {
      setConfirm((c) => ({ ...c, loading: true }));
      await axios.delete(`/api/solutions/${confirm.id}`);
      setConfirm({ show: false, id: '', loading: false });
      if (sel?._id === confirm.id) setSel(null);
      toast.success('Solução eliminada!');
      reload();
    } catch (e) {
      setConfirm({ show: false, id: '', loading: false });
      toast.error(e?.response?.data?.error || 'Falha ao eliminar');
    }
  };

  // ---------- produtos relacionados ----------
  const {
    data: relProducts,
    loading: loadingRel,
    error: errRel,
    reload: reloadRel
  } = useFetch(async () => {
    if (!sel?._id) return [];
    const r = await axios.get(`/api/solutions/${sel._id}/products`);
    return r.data?.data || [];
  }, [sel?._id]);

  // estado local para update otimista da lista
  const [relList, setRelList] = useState([]);
  useEffect(() => {
    setRelList(Array.isArray(relProducts) ? relProducts : []);
  }, [relProducts]);
  useEffect(() => {
    if (!sel?._id) setRelList([]);
  }, [sel?._id]);

  const [productToAdd, setProductToAdd] = useState('');

  const addRelatedProduct = async () => {
    if (!sel?._id || !productToAdd) return;
    try {
      const r = await axios.post(`/api/solutions/${sel._id}/products`, { productId: productToAdd });
      const added = r.data?.data; // backend deve devolver {_id, wl_name, wl_images:[]}
      if (added?._id) {
        setRelList((prev) => {
          const list = Array.isArray(prev) ? prev.slice() : [];
          const exists = list.some((p) => String(p._id) === String(added._id));
          return exists ? list : [added, ...list];
        });
      }
      setProductToAdd('');
      await reloadRel(); // confirma com servidor
      toast.success('Produto adicionado!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao adicionar produto');
    }
  };

  const removeRelatedProduct = async (pid) => {
    try {
      // otimista
      setRelList((prev) => (prev || []).filter(p => String(p._id) !== String(pid)));
      await axios.delete(`/api/solutions/${sel._id}/products/${pid}`);
      toast.success('Produto removido');
    } catch (e) {
      await reloadRel(); // repõe caso falhe
      toast.error(e?.response?.data?.error || 'Falha ao remover produto');
    }
  };

  // ---------- kits ----------
  const [productNameCache, setProductNameCache] = useState(new Map());
  const cacheName = (id, name) => {
    setProductNameCache(prev => {
      if (prev.get(id) === name) return prev;
      const n = new Map(prev);
      n.set(id, name);
      return n;
    });
  };

  const resolveProductName = async (id) => {
    if (!id) return '';
    if (productNameCache.has(id)) return productNameCache.get(id);
    try {
      const r = await axios.get(`/api/products/${id}`).catch(() => null);
      const name = r?.data?.data?.wl_name || '';
      if (name) cacheName(id, name);
      return name || id;
    } catch {
      return id;
    }
  };

  const {
    data: kits,
    loading: loadingKits,
    error: errKits,
    reload: reloadKits
  } = useFetch(async () => {
    if (!sel?._id) return [];
    const r = await axios.get(`/api/solutions/${sel._id}/kits`);
    const list = r.data?.data || [];
    list.forEach(k => (k.products || []).forEach(p => cacheName(String(p._id), p.wl_name)));
    return list;
  }, [sel?._id]);

  const [kitsList, setKitsList] = useState([]);
  useEffect(() => { setKitsList(Array.isArray(kits) ? kits : []); }, [kits]);
  useEffect(() => { if (!sel?._id) setKitsList([]); }, [sel?._id]);

  const [kitName, setKitName] = useState('');
  const [kitProducts, setKitProducts] = useState([]);

  const onPickKitProduct = async (id) => {
    if (!id) return;
    setKitProducts(prev => prev.includes(id) ? prev : [...prev, id]);
    resolveProductName(id);
  };

  const addKit = async () => {
    if (!kitName || !kitProducts?.length) return;
    try {
      const r = await axios.post(`/api/solutions/${sel._id}/kits`, { name: kitName, productIds: kitProducts });
      setKitName(''); setKitProducts([]);
      // POST já deve devolver { ...kit, products:[{_id, wl_name,...}] }
      setKitsList((prev) => [r.data?.data, ...(prev || [])]);
      toast.success('Kit criado!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao criar kit');
    }
  };

  const removeKit = async (kitId) => {
    try {
      setKitsList((prev) => (prev || []).filter(k => k._id !== kitId)); // otimista
      await axios.delete(`/api/solutions/${sel._id}/kits/${kitId}`);
      toast.success('Kit removido');
    } catch (e) {
      await reloadKits();
      toast.error(e?.response?.data?.error || 'Falha ao remover kit');
    }
  };

  // ---------- exemplos ----------
  const {
    data: solExamples,
    loading: loadingEx,
    error: errEx,
    reload: reloadExamples
  } = useFetch(async () => {
    if (!sel?._id) return [];
    const r = await axios.get(`/api/solutions/${sel._id}/examples`);
    return r.data?.data || [];
  }, [sel?._id]);

  const [exTitle, setExTitle] = useState('');
  const [exDesc, setExDesc] = useState('');
  const [exImg, setExImg] = useState('');
  const [exFile, setExFile] = useState(null);
  const [exUp, setExUp] = useState(false);

  const doExUpload = async () => {
    if (!exFile) return;
    try {
      setExUp(true);
      const fd = new FormData();
      fd.append('file', exFile);
      const r = await axios.post('/api/upload', fd);
      setExImg(r.data?.path || '');
      toast.success('Imagem do exemplo enviada!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha no upload');
    } finally {
      setExUp(false);
    }
  };

  const addExample = async () => {
    if (!sel?._id || !exTitle || !exImg) return;
    try {
      await axios.post(`/api/solutions/${sel._id}/examples`, { title: exTitle, description: exDesc, image: exImg });
      setExTitle(''); setExDesc(''); setExImg(''); setExFile(null);
      await reloadExamples();
      toast.success('Exemplo adicionado!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao adicionar exemplo');
    }
  };

  const removeExample = async (exampleId) => {
    try {
      await axios.delete(`/api/solutions/${sel._id}/examples/${exampleId}`);
      await reloadExamples();
      toast.success('Exemplo removido');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao remover exemplo');
    }
  };

  // ---------- Edição inline dos exemplos ----------
  const [editingExId, setEditingExId] = useState(null);
  const [editEx, setEditEx] = useState({ title: '', description: '', image: '' });
  const [editFile, setEditFile] = useState(null);
  const [editUploading, setEditUploading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  const startEditExample = (it) => {
    setEditingExId(it._id);
    setEditEx({ title: it.title || '', description: it.description || '', image: it.image || '' });
    setEditFile(null);
  };

  const cancelEditExample = () => {
    setEditingExId(null);
    setEditEx({ title: '', description: '', image: '' });
    setEditFile(null);
    setEditUploading(false);
    setEditSaving(false);
  };

  const doEditUpload = async () => {
    if (!editFile) return;
    try {
      setEditUploading(true);
      const fd = new FormData();
      fd.append('file', editFile);
      const r = await axios.post('/api/upload', fd);
      const path = r.data?.path || '';
      setEditEx((prev) => ({ ...prev, image: path }));
      toast.success('Nova imagem carregada!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha no upload');
    } finally {
      setEditUploading(false);
    }
  };

  const saveEditExample = async () => {
    if (!sel?._id || !editingExId) return;
    try {
      setEditSaving(true);
      await axios.put(`/api/solutions/${sel._id}/examples/${editingExId}`, {
        title: editEx.title,
        description: editEx.description,
        image: editEx.image,
      });
      toast.success('Exemplo atualizado!');
      await reloadExamples();
      cancelEditExample();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Falha ao atualizar exemplo');
      setEditSaving(false);
    }
  };

  return (
    <div className="d-block">
      <Toaster position="top-right" />

      {/* Pesquisa + Nova */}
      <div className="col-lg-12">
        <div className="d-flex gap-2 align-items-end mb-2">
          <div className="flex-grow-1">
            <label className="form-label">Pesquisar</label>
            <InputGroup>
              <Form.Control value={q} onChange={(e) => setQ(e.target.value)} placeholder="Título da solução…" />
              <Button variant="outline-secondary" onClick={reload}>Buscar</Button>
            </InputGroup>
          </div>
          <Button className="mt-4" onClick={() => { setForm({ title: '', description: '', image: '' }); setFile(null); setShowCreate(true); }}>
            <FiPlus className="me-1" /> Nova
          </Button>
        </div>

        {loading ? <Spinner /> : error ? <Alert variant="danger">{error}</Alert> : (
          <div className="vstack gap-2">
            {(solutions || []).map((s) => (
              <Card
                key={s._id}
                className={`shadow-sm ${sel?._id === s._id ? 'border-primary' : ''}`}
                onClick={() => setSel(s)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="d-flex align-items-center gap-2">
                  <div className="rounded overflow-hidden" style={{ width: 56, height: 56, border: '1px solid #eee' }}>
                    {s.image ? (
                      <img src={withHost(s.image)} className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                        <FiImage />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{s.title}</div>
                  </div>
                  <div className="hstack gap-2">
                    <Button size="sm" variant="outline-primary" onClick={(e) => { e.stopPropagation(); openEdit(s); }}>
                      <FiEdit3 />
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={(e) => { e.stopPropagation(); askDelete(s._id); }}>
                      <FiTrash2 />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
            {!solutions?.length && <div className="text-muted">Sem soluções ainda. Cria a primeira 👆</div>}
          </div>
        )}
      </div>

      {/* Detalhe */}
      <div className="col-lg-12 mt-3">
        {!sel ? (
          <Card className="h-100">
            <Card.Body className="text-muted d-flex align-items-center justify-content-center" style={{ minHeight: 300 }}>
              Seleciona uma solução à esquerda para configurar.
            </Card.Body>
          </Card>
        ) : (
          <Card className="h-100">
            <Card.Header className="bg-white">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded overflow-hidden" style={{ width: 40, height: 40, border: '1px solid #eee' }}>
                    {sel.image ? (
                      <img src={withHost(sel.image)} className="w-100 h-100 object-fit-cover" />
                    ) : <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"><FiImage /></div>}
                  </div>
                  <div>
                    <div className="fw-semibold pr-2">{sel.title}</div>
                  </div>
                </div>
                <Button size="sm" variant="outline-primary" onClick={() => openEdit(sel)}><FiEdit3 className="me-1" /> Editar</Button>
              </div>
            </Card.Header>

            <Card.Body>
              <Tabs defaultActiveKey="products" id="solution-tabs">
                {/* Produtos Relacionados */}
                <Tab eventKey="products" title={<><FiPackage className="me-1" /> Produtos</>}>
                  <Row className="g-3 align-items-end">
                    <Col md={8}>
                      <Form.Label>Adicionar produto</Form.Label>
                      <ProductPicker value={productToAdd} onChange={setProductToAdd} placeholder="Pesquisar produto…" />
                    </Col>
                    <Col md={4}>
                      <Button className="mt-4 w-100" disabled={!productToAdd} onClick={addRelatedProduct}>
                        <FiPlus className="me-1" /> Adicionar
                      </Button>
                    </Col>
                  </Row>

                  <div className="mt-3">
                    {loadingRel ? <Spinner /> : errRel ? <Alert variant="danger">{errRel}</Alert> : !relList?.length ? (
                      <div className="text-muted">Ainda sem produtos relacionados.</div>
                    ) : (
                      <div className="vstack gap-2">
                        {relList.map((p) => (
                          <Card key={p._id} className="shadow-sm">
                            <Card.Body className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-2">
                                <div className="rounded overflow-hidden" style={{ width: 40, height: 40, border: '1px solid #eee' }}>
                                  {p.wl_images?.[0] ? (
                                    <img src={withHost(p.wl_images[0])} className="w-100 h-100 object-fit-cover" />
                                  ) : <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted"><FiImage /></div>}
                                </div>
                                <div>
                                  <div className="fw-semibold">{p.wl_name}</div>
                                  <div className="small text-muted">{p.wl_category?.wl_name || '—'}</div>
                                </div>
                              </div>
                              <Button size="sm" variant="outline-danger" onClick={() => removeRelatedProduct(p._id)}>
                                <FiTrash2 className="me-1" /> Remover
                              </Button>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </Tab>

                {/* Kits */}
                <Tab eventKey="kits" title={<><FiLayers className="me-1" /> Kits</>}>
                  <Row className="g-3 align-items-end">
                    <Col md={4}>
                      <Form.Label>Nome do kit</Form.Label>
                      <Form.Control value={kitName} onChange={(e) => setKitName(e.target.value)} placeholder="Ex.: Kit Básico" />
                    </Col>
                    <Col md={6}>
                      <Form.Label>Produtos do kit</Form.Label>
                      <div className="d-flex gap-2">
                        <ProductPicker
                          value=""
                          onChange={onPickKitProduct}
                          placeholder="Adicionar produto ao kit…"
                        />
                        <Button variant="outline-secondary" onClick={() => setKitProducts([])}>Limpar</Button>
                      </div>
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {kitProducts.map((id) => (
                          <Badge key={id} bg="light" text="dark" className="p-2">
                            {productNameCache.get(id) || <code>{id}</code>}
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="ms-2 py-0 px-1"
                              onClick={() => setKitProducts((prev) => prev.filter((x) => x !== id))}
                            >
                              x
                            </Button>
                          </Badge>
                        ))}
                        {!kitProducts.length && <span className="text-muted">Sem produtos no kit.</span>}
                      </div>
                    </Col>
                    <Col md={2}>
                      <Button className="mt-4 w-100" disabled={!kitName || !kitProducts.length} onClick={addKit}>
                        <FiPlus className="me-1" /> Criar kit
                      </Button>
                    </Col>
                  </Row>

                  <KitsList
                    loading={loadingKits}
                    error={errKits}
                    list={kitsList}
                    onRemove={removeKit}
                  />
                </Tab>

                {/* Exemplos */}
                <Tab eventKey="examples" title={<><FiGrid className="me-1" /> Exemplos</>}>
                  <Card className="mb-3">
                    <Card.Header className="bg-white"><FiPlus className="me-2" />Adicionar exemplo</Card.Header>
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={4}>
                          <Form.Label>Título</Form.Label>
                          <Form.Control value={exTitle} onChange={(e) => setExTitle(e.target.value)} placeholder="Ex.: Estação Central" />
                        </Col>
                        <Col md={5}>
                          <Form.Label>Descrição</Form.Label>
                          <Form.Control value={exDesc} onChange={(e) => setExDesc(e.target.value)} placeholder="Breve nota…" />
                        </Col>
                        <Col md={3}>
                          <Form.Label>Imagem</Form.Label>
                          <InputGroup>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setExFile(e.target.files?.[0] || null)} />
                            <Button variant="outline-secondary" disabled={!exFile || exUp} onClick={doExUpload}>
                              {exUp ? 'A enviar…' : 'Upload'}
                            </Button>
                          </InputGroup>
                          {exImg && <small className="text-success d-block mt-1">Enviado: {exImg}</small>}
                        </Col>
                        <Col md={12} className="d-flex justify-content-end">
                          <Button disabled={!exTitle || !exImg} onClick={addExample}>
                            <FiPlus className="me-1" /> Adicionar exemplo
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  {loadingEx ? <Spinner /> : errEx ? <Alert variant="danger">{errEx}</Alert> : !solExamples?.length ? (
                    <div className="text-muted">Sem exemplos ainda.</div>
                  ) : (
                    <Row className="g-3">
                      {solExamples.map((it) => {
                        const isEditing = editingExId === it._id;
                        return (
                          <Col key={it._id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100 shadow-sm">
                              <Ratio aspectRatio="1x1" className="rounded-top overflow-hidden">
                                <img src={withHost(isEditing ? editEx.image || it.image : it.image)} alt={it.title} className="w-100 h-100 object-fit-cover" />
                              </Ratio>

                              <Card.Body>
                                {!isEditing ? (
                                  <>
                                    <div className="fw-semibold text-truncate" title={it.title}>{it.title}</div>
                                    <div className="small text-muted">{it.description || '—'}</div>
                                  </>
                                ) : (
                                  <div className="vstack gap-2">
                                    <div>
                                      <Form.Label className="small mb-1">Título</Form.Label>
                                      <Form.Control
                                        value={editEx.title}
                                        onChange={(e) => setEditEx((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Título do exemplo"
                                      />
                                    </div>
                                    <div>
                                      <Form.Label className="small mb-1">Descrição</Form.Label>
                                      <Form.Control
                                        value={editEx.description}
                                        onChange={(e) => setEditEx((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Descrição (opcional)"
                                      />
                                    </div>
                                    <div>
                                      <Form.Label className="small mb-1">Imagem</Form.Label>
                                      <InputGroup>
                                        <Form.Control
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                          disabled={editUploading}
                                        />
                                        <Button
                                          variant="outline-secondary"
                                          disabled={!editFile || editUploading}
                                          onClick={doEditUpload}
                                        >
                                          {editUploading ? 'A enviar…' : 'Upload'}
                                        </Button>
                                      </InputGroup>
                                      {editEx.image && <small className="text-success d-block mt-1">Nova: {editEx.image}</small>}
                                    </div>
                                  </div>
                                )}
                              </Card.Body>

                              <Card.Footer className="bg-white d-flex justify-content-between">
                                {!isEditing ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() => startEditExample(it)}
                                    >
                                      <FiEdit3 className="me-1" /> Editar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline-danger"
                                      onClick={() => removeExample(it._id)}
                                    >
                                      <FiTrash2 className="me-1" /> Remover
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={cancelEditExample}
                                      disabled={editSaving || editUploading}
                                    >
                                      Cancelar
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={saveEditExample}
                                      disabled={editSaving || !editEx.title || !editEx.image}
                                    >
                                      {editSaving ? 'A guardar…' : 'Guardar'}
                                    </Button>
                                  </>
                                )}
                              </Card.Footer>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Modal Nova */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="lg">
        <Form onSubmit={createSolution}>
          <Modal.Header closeButton><Modal.Title>Nova Solução</Modal.Title></Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Título</Form.Label>
                  <Form.Control required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Imagem</Form.Label>
                  <InputGroup>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Button variant="outline-secondary" disabled={!file || uploading} onClick={doUpload}>
                      {uploading ? 'A enviar…' : 'Upload'}
                    </Button>
                  </InputGroup>
                  {form.image && <small className="text-success d-block mt-1">Enviado: {form.image}</small>}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Editar */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
        <Form onSubmit={updateSolution}>
          <Modal.Header closeButton><Modal.Title>Editar Solução</Modal.Title></Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Título</Form.Label>
                  <Form.Control required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Imagem</Form.Label>
                  <InputGroup>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    <Button variant="outline-secondary" disabled={!file || uploading} onClick={doUpload}>
                      {uploading ? 'A enviar…' : 'Upload'}
                    </Button>
                  </InputGroup>
                  {form.image && <small className="text-success d-block mt-1">Atual: {form.image}</small>}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control as="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button type="submit">Atualizar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Confirmar remoção */}
      <Modal show={confirm.show} onHide={() => setConfirm({ show: false, id: '', loading: false })} centered>
        <Modal.Header closeButton><Modal.Title>Eliminar solução</Modal.Title></Modal.Header>
        <Modal.Body>Esta ação é irreversível. Continuar?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirm({ show: false, id: '', loading: false })} disabled={confirm.loading}>Cancelar</Button>
          <Button variant="danger" onClick={doDelete} disabled={confirm.loading}>
            {confirm.loading ? 'A eliminar…' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


/* Sub-componente para listar Kits (só para limpar JSX principal) */
function KitsList({ loading, error, list, onRemove }) {
  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!list?.length) return <div className="text-muted">Nenhum kit ainda.</div>;

  return (
    <div className="mt-4 vstack gap-2">
      {list.map((k) => (
        <Card key={k._id} className="shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-start justify-content-between">
              <div className="me-3">
                <div className="fw-semibold">{k.name}</div>
                <div className="small text-muted">{(k.products || []).length} produto(s)</div>
              </div>
              <Button size="sm" variant="outline-danger" onClick={() => onRemove(k._id)}>
                <FiTrash2 className="me-1" /> Remover
              </Button>
            </div>

            {!!(k.products || []).length && (
              <div className="mt-3 d-flex flex-wrap gap-2">
                {k.products.map((p) => (
                  <Badge key={p._id} bg="light" text="dark" className="p-2">
                    <span className="fw-semibold">{p.wl_name}</span>
                  </Badge>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}


/* -------------------------------- STYLES ---------------------------------- */
const layoutStyles = `
  .object-fit-cover { object-fit: cover; }
  .app-shell { display:flex; gap:1rem; }
  .app-sidebar {
    width: 260px; flex: 0 0 260px;
    background:#ffffff; border:1px solid #e9ecef; border-radius: .75rem;
    height: calc(100vh - 140px); position: sticky; top: 82px; padding:.75rem;
  }
  .app-content { flex:1; }
  .menu-item { display:flex; align-items:center; gap:.6rem; padding:.55rem .65rem; border-radius:.5rem; color:#334155; text-decoration:none; width:100%; background:transparent; border:0; }
  .menu-item:hover { background:#f8fafc; color:#111827; }
  .menu-item.active { background:#eef2ff; color:#111827; box-shadow: inset 0 0 0 1px #e9ecef; }
  @media (max-width: 992px){
    .app-shell{ flex-direction: column; }
    .app-sidebar{ width:100%; height:auto; position:static; }
  }
`;


/* ------------------------------- CATEGORY -------------------------------- */
 function slugify(s = "") {
  return String(s)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function CategoriesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // criação
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  // edição
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState({ name: "", slug: "" });

  // apagar
  const [confirm, setConfirm] = useState({ show: false, id: "", loading: false, msg: "" });

  // reordenação local (bulk)
  const [dirtyOrder, setDirtyOrder] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      const r = await axios.get("/api/categories", { params: { _ts: Date.now() } });
      setItems(r.data?.data || []);
    } finally {
      setLoading(false);
      setDirtyOrder(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  // ===== CREATE =====
  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
    };
    await axios.post("/api/categories", payload);
    setShowCreate(false);
    setForm({ name: "", slug: "" });
    fetchList();
  };

  // ===== EDIT =====
  const openEdit = (row) => {
    const c = row;
    setEditId(c._id);
    setEditForm({ name: c.wl_name || "", slug: c.wl_slug || "" });
    setShowEdit(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {};
    if (editForm.name.trim()) payload.name = editForm.name.trim();
    if (editForm.slug.trim()) payload.slug = editForm.slug.trim();
    await axios.put(`/api/categories/${editId}`, payload);
    setShowEdit(false);
    fetchList();
  };

  // ===== DELETE =====
  const askDelete = (id) => setConfirm({ show: true, id, loading: false, msg: "" });

  const doDelete = async () => {
    try {
      setConfirm((c) => ({ ...c, loading: true, msg: "" }));
      await axios.delete(`/api/categories/${confirm.id}`);
      setConfirm({ show: false, id: "", loading: false, msg: "" });
      fetchList();
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Falha ao eliminar";
      setConfirm((c) => ({ ...c, loading: false, msg }));
    }
  };

  // ===== REORDER (↑/↓ imediato) =====
  const stepReorder = async (id, direction) => {
    await axios.patch(`/api/categories/${id}/reorder-step`, { direction });
    fetchList();
  };

  // ===== REORDER (bulk local + guardar) =====
  const moveLocal = (idx, dir) => {
    const to = idx + (dir === "up" ? -1 : 1);
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[idx], next[to]] = [next[to], next[idx]];
    setItems(next);
    setDirtyOrder(true);
  };

  const saveBulkOrder = async () => {
    const orderedIds = items.map((c) => c._id);
    await axios.post("/api/categories/reorder", { orderedIds });
    setDirtyOrder(false);
    fetchList();
  };

  // ===== UI =====
  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <h4 className="m-0">Categorias</h4>
        <div className="ms-auto d-flex gap-2">
          {dirtyOrder && (
            <button className="btn btn-primary" onClick={saveBulkOrder}>
              Guardar ordem
            </button>
          )}
          <button className="btn btn-success" onClick={() => setShowCreate(true)}>
            + Nova Categoria
          </button>
          <button className="btn btn-outline-secondary" onClick={() => fetchList()}>
            Recarregar
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-4 text-center">A carregar…</div>
          ) : !items.length ? (
            <div className="p-4 text-center text-muted">Sem categorias.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 72 }}>#</th>
                    <th>Nome</th>
                    <th>Slug</th>
                    <th style={{ width: 280 }} className="text-end">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c, i) => (
                    <tr key={c._id}>
                      <td className="text-muted">{i + 1}</td>
                      <td className="fw-semibold">{c.wl_name}</td>
                      <td><code>{c.wl_slug}</code></td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                         
                         
                          {/* mover 1 passo no servidor */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="↑ mover para cima"
                            disabled={i === 0}
                            onClick={() => stepReorder(c._id, "up")}
                          >
                            ↑  
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="↓ mover para baixo"
                            disabled={i === items.length - 1}
                            onClick={() => stepReorder(c._id, "down")}
                          >
                            ↓  
                          </button>

                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => openEdit(c)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => askDelete(c._id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {dirtyOrder && (
                <div className="p-3 border-top d-flex justify-content-end gap-2">
                  <button className="btn btn-light" onClick={() => fetchList()}>
                    Cancelar alterações
                  </button>
                  <button className="btn btn-primary" onClick={saveBulkOrder}>
                    Guardar ordem
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Criar (estilo do modal de “Novo Produto”) */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} size="lg">
        <Form onSubmit={handleCreate}>
          <Modal.Header closeButton>
            <Modal.Title>Nova Categoria</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slug (opcional)</Form.Label>
                  <Form.Control
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder={slugify(form.name)}
                  />
                  <small className="text-muted">Vazio → será “{slugify(form.name) || "slug"}”.</small>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL: Editar (também no mesmo estilo) */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} size="lg">
        <Form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Categoria</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    value={editForm.slug}
                    onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                    placeholder={slugify(editForm.name)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button type="submit" variant="warning">Atualizar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* MODAL: Confirm Delete (podes manter o teu ConfirmDialog se preferires) */}
      <Modal show={confirm.show} onHide={() => setConfirm({ show: false, id: "", loading: false, msg: "" })}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Eliminar categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Queres mesmo eliminar esta categoria? Esta ação é irreversível.</p>
          {confirm.msg && <div className="alert alert-warning mt-2">{confirm.msg}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setConfirm({ show: false, id: "", loading: false, msg: "" })}>
            Cancelar
          </Button>
          <Button variant="danger" disabled={confirm.loading} onClick={doDelete}>
            {confirm.loading ? "A eliminar…" : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}


/* ------------------------------- DASHBOARD -------------------------------- */
export default function Home() {
  const [section, setSection] = useState('products');

  const logout = async () => {
    try { await axios.post('/api/auth/logout'); window.location.href = '/authentication/login/'; }
    catch { alert('Erro fazendo logout!'); }
  };

  const MenuItem = ({ id, icon, label }) => (
    <button
      onClick={() => setSection(id)}
      className={`menu-item ${section === id ? 'active' : ''}`}
      aria-current={section === id ? 'page' : undefined}
    >
      {icon}{label}
    </button>
  );

  return (
    <div className="container-fluid py-3">
      <style>{layoutStyles}</style>
      <HeaderBar onLogout={logout} />

      <div className="app-shell">
        {/* SIDEBAR */}
        <aside className="app-sidebar">
          <div className="mb-2 text-uppercase small text-muted px-1">Menu</div>
          <MenuItem id="products" icon={<FiInbox />} label="Produtos" />
          <MenuItem id="categories" icon={<TbCategory2 />} label="Categorias" />
          <MenuItem id="featuredHome" icon={<FiHome />} label="Destaques Home (4)" />
          <MenuItem id="featuredList" icon={<FiList />} label="Destaques (Lista)" />
          <MenuItem id="topOverall" icon={<FiStar />} label="Top • Geral" />
          <MenuItem id="topCategory" icon={<FiTag />} label="Top • Categoria" />
          <MenuItem id="successCases" icon={<FiLayers />} label="Casos de Sucesso" />
          <MenuItem id="messages" icon={<FiMessageSquare />} label="Mensagens" />
          <MenuItem id="users" icon={<FiUsers />} label="Utilizadores" />
          <MenuItem id="topLiked" icon={<FiThumbsUp />} label="Top Liked" /> 

          <div className="mt-3 text-uppercase small text-muted px-1">Customização</div>
          <MenuItem id="customization" icon={<FiSliders />} label="Categorias & Produtos" />
          <MenuItem id="solutions" icon={<FiSliders />} label="Soluções" />
        </aside>

        {/* CONTEÚDO */}
        <main className="app-content">
          {section === 'products' && <ProductsTab />}
          {section === 'categories' && <CategoriesTab />}  
          {section === 'featuredHome' && <FeaturedHomeTab />}
          {section === 'featuredList' && <FeaturedListTab />}
          {section === 'topOverall' && <TopOverallTab />}
          {section === 'topCategory' && <TopByCategoryTab />}
          {section === 'successCases' && <SuccessCasesTab />}
          {section === 'messages' && <MessagesTab />}
          {section === 'users' && <UsersTab />}
          {section === 'topLiked' && <TopLikedTab />}
          {section === 'customization' && <CustomizationSection />}
          {section === 'solutions' && <SolutionsTab />}
        </main>
      </div>
    </div>
  );
}
