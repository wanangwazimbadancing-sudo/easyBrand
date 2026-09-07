
import { CheckCircle2, Play, Plus, Upload, X, Trash2, Video, Crown, Rocket, TrendingUp} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { inputClass } from "../../assets/mockdata";
import PlansEditor from "./contentComponets/PlansEditor";
import Field from "./contentComponets/Field";

const PLAN_ICON_MAP = {
  starter: Rocket,
  growth: TrendingUp,
  elite: Crown,
};

const normalizePlans = (savedPlans = []) =>
  savedPlans.map((plan) => ({
    ...plan,
    icon: PLAN_ICON_MAP[plan.id] || Rocket,
  }));



const CONTENT_TABS = ['Plans', 'Content', 'FAQs', 'Contact'];











// Figures out how (or whether) a pasted video URL can be previewed inline.
// Direct file links play in a native <video>. YouTube links get embedded.
// Everything else (TikTok, Vimeo, etc.) can't be embedded without their own
// player script, so we show a clear "open the link" fallback instead of
// silently showing nothing.
const isDirectVideoUrl = (url) => {
  if (!url || !url.trim()) return false;
  const trimmed = url.trim();

  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed)) {
    return true;
  }

  return /res\.cloudinary\.com/i.test(trimmed) && /\/video\//i.test(trimmed) && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed);
};

function getVideoPreview(url) {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();

  if (isDirectVideoUrl(trimmed)) {
    return { type: 'file', src: trimmed };
  }

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (ytMatch) {
    return { type: 'youtube', src: `https://www.youtube.com/embed/${ytMatch[1]}` };
  }

  try {
    const host = new URL(trimmed).hostname.replace(/^www\./, '');
    return { type: 'external', href: trimmed, host };
  } catch {
    return null;
  }
}

function VideoUrlPreview({ url, title }) {
  const preview = getVideoPreview(url);
  if (!preview) return null;

  if (preview.type === 'file') {
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 bg-black">
        <video src={preview.src} className="w-full max-h-52 bg-black" controls />
      </div>
    );
  }

  if (preview.type === 'youtube') {
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 bg-black aspect-video">
        <iframe
          src={preview.src}
          title={title || 'Video preview'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={preview.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:border-gray-300 transition-colors"
    >
      <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
        <Play className="w-4 h-4 text-gray-500 ml-0.5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-700">Can't preview {preview.host} links here</p>
        <p className="text-[11px] text-gray-400 truncate">Tap to open and watch on {preview.host}</p>
      </div>
    </a>
  );
}

function VideoUploadCard({ video, onUpdateField, onUploadFile, onRemoveFile, onRemoveCard }) {
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputId = `video-upload-${video.id}`;

  const handleFiles = (fileList) => {
    const file = fileList && fileList[0];
    if (file && file.type.startsWith('video/')) {
      onUploadFile(video.id, file);
    }
  };

  const handleDelete = () => {
    onRemoveCard(video.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100  p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
            <Video className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Video Title</label>
            <input
              value={video.title}
              onChange={(e) => onUpdateField(video.id, 'title', e.target.value)}
              placeholder="Enter a video title"
              className={`${inputClass} cursor-text`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-6">
          {!showDeleteConfirm && (
            <button onClick={() => setShowDeleteConfirm(true)} className="shrink-0 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {showDeleteConfirm && (
            <div className="flex items-center gap-2 text-xs">
              <button onClick={handleDelete} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">
                Delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {video.previewUrl ? (
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Video File</label>
          <div className="rounded-lg overflow-hidden border border-gray-200 bg-black">
            <video src={video.previewUrl} className="w-full max-h-52 bg-black" controls />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 truncate">{video.fileName}</p>
            <button
              onClick={() => onRemoveFile(video.id)}
              className="text-xs text-red-500 hover:text-red-600 font-medium shrink-0 ml-3 cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          <label className="text-xs text-gray-500 mb-1 block">Upload Video</label>
          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Upload className={`w-5 h-5 ${isDragging ? 'text-violet-500' : 'text-gray-400'}`} />
            <p className="text-xs text-gray-600">
              <span className="text-violet-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-[10px] text-gray-400">MP4, MOV or WebM up to 100MB</p>
            <input
              id={inputId}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <label className="text-xs text-gray-500 mb-1 block">Video URL</label>
          <input
            value={video.url}
            onChange={(e) => onUpdateField(video.id, 'url', e.target.value)}
            placeholder="https://..."
            className={`${inputClass} cursor-text`}
          />
          <VideoUrlPreview url={video.url} title={video.title} />
        </>
      )}
    </div>
  );
}

function ContentEditor({ videos, setVideos }) {
  const updateVideo = (id, field, value) =>
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)));

  const removeVideo = (id) => {
    setVideos((prev) => {
      const target = prev.find((v) => v.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((v) => v.id !== id);
    });
  };

  const addVideo = () =>
    setVideos((prev) => [...prev, { id: Date.now(), title: '', url: '', file: null, previewUrl: null, fileName: null }]);

  const uploadVideoFile = async (id, file) => {
    const previewUrl = URL.createObjectURL(file);

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (v.previewUrl) URL.revokeObjectURL(v.previewUrl);
        return { ...v, file, previewUrl, fileName: file.name, url: '' };
      })
    );

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post('https://easybrand.onrender.com/api/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = response.data?.url;
      if (!uploadedUrl) throw new Error('Cloudinary upload response missing URL');

      setVideos((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          if (v.previewUrl) URL.revokeObjectURL(v.previewUrl);
          return { ...v, file: null, previewUrl: null, fileName: file.name, url: uploadedUrl };
        })
      );
    } catch (err) {
      console.error('Video upload failed:', err);
      setVideos((prev) =>
        prev.map((v) => {
          if (v.id !== id) return v;
          if (v.previewUrl) URL.revokeObjectURL(v.previewUrl);
          return { ...v, file: null, previewUrl: null, fileName: null, url: '' };
        })
      );
      toast.error('Failed to upload video. Please try again.');
    }
  };

  const removeVideoFile = (id) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (v.previewUrl) URL.revokeObjectURL(v.previewUrl);
        return { ...v, file: null, previewUrl: null, fileName: null };
      })
    );
  };

  return (
    <div className="max-w-2xl space-y-4">
      {videos.map((v) => (
        <VideoUploadCard
          key={v.id}
          video={v}
          onUpdateField={updateVideo}
          onUploadFile={uploadVideoFile}
          onRemoveFile={removeVideoFile}
          onRemoveCard={removeVideo}
        />
      ))}

      <button
        onClick={addVideo}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-3.5 text-sm text-gray-500 hover:border-gray-400 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add Video
      </button>
    </div>
  );
}


function ContactInfoEditor({ contact, setContact }) {
  const update = (field, value) => setContact((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white rounded-xl border border-gray-100  p-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="Email Address">
          <input value={contact.email} onChange={(e) => update('email', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
        <Field label="Phone Number">
          <input value={contact.phone} onChange={(e) => update('phone', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Field label="WhatsApp Number">
          <input value={contact.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
        <Field label="Address">
          <input value={contact.address} onChange={(e) => update('address', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
      </div>

      <p className="text-xs text-gray-500 mb-2 font-medium mt-2">Social Links</p>
      <div className="space-y-3">
        <Field label="Instagram">
          <input value={contact.instagram} onChange={(e) => update('instagram', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
        <Field label="Facebook">
          <input value={contact.facebook} onChange={(e) => update('facebook', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
        <Field label="X (Twitter)">
          <input value={contact.twitter} onChange={(e) => update('twitter', e.target.value)} className={`${inputClass} cursor-text`} />
        </Field>
      </div>
    </div>
  );
}

function FaqsEditor({ faqs, setFaqs }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const updateFaq = (id, field, value) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));

  const removeFaq = (id) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirm(null);
  };

  const addFaq = () =>
    setFaqs((prev) => [...prev, { id: Date.now(), question: '', answer: '' }]);

  return (
    <div className="max-w-2xl space-y-4">
      {faqs.map((f) => (
        <div key={f.id} className="bg-white rounded-xl border border-gray-100  p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Question</label>
              <input
                value={f.question}
                onChange={(e) => updateFaq(f.id, 'question', e.target.value)}
                placeholder="Enter a question"
                className={`${inputClass} cursor-text`}
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              {deleteConfirm !== f.id && (
                <button onClick={() => setDeleteConfirm(f.id)} className="shrink-0 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              {deleteConfirm === f.id && (
                <div className="flex items-center gap-2 text-xs">
                  <button onClick={() => removeFaq(f.id)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer">
                    Delete
                  </button>
                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 cursor-pointer">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <label className="text-xs text-gray-500 mb-1 block">Answer</label>
          <textarea
            value={f.answer}
            onChange={(e) => updateFaq(f.id, 'answer', e.target.value)}
            placeholder="Enter the answer"
            rows={2}
            className={`${inputClass} resize-none cursor-text`}
          />
        </div>
      ))}

      <button
        onClick={addFaq}
        className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-3.5 text-sm text-gray-500 hover:border-gray-400 cursor-pointer"
      >
        <Plus className="w-4 h-4" /> Add FAQ
      </button>
    </div>
  );
}

const ContentPlansPage = () => {
  const [tab, setTab] = useState('Plans');
  const [selectedPlanId, setSelectedPlanId] = useState('starter');
  const [plans, setPlans] = useState([]);
  const [videos, setVideos] = useState([]);
  const [contact, setContact] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError('');

        const [plansRes, videosRes, contactRes, faqsRes] = await Promise.all([
          axios.get('https://easybrand.onrender.com/api/page-data/plans'),
          axios.get('https://easybrand.onrender.com/api/page-data/videos'),
          axios.get('https://easybrand.onrender.com/api/page-data/contact'),
          axios.get('https://easybrand.onrender.com/api/page-data/faqs'),
        ]);

        const plansData = Array.isArray(plansRes.data.plans) ? plansRes.data.plans : [];
        const videosData = Array.isArray(videosRes.data.videos) ? videosRes.data.videos : [];
        const contactData = contactRes.data.contact || {};
        const faqData = Array.isArray(faqsRes.data.faqs) ? faqsRes.data.faqs : [];

        setPlans(normalizePlans(plansData));
        setVideos(videosData.map((v) => ({ ...v, file: null, previewUrl: null, fileName: null })));
        setContact({
          email: contactData.email || '',
          phone: contactData.phone || '',
          whatsapp: contactData.whatsapp || '',
          address: contactData.address || '',
          instagram: contactData.instagram || '',
          facebook: contactData.facebook || '',
          twitter: contactData.twitter || '',
        });
        setFaqs(faqData);
      } catch (err) {
        console.error('Error fetching page data:', err);
        setError('Failed to load data from the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const handleSave = async () => {
    // Validate FAQs before saving
    const invalidFaqs = faqs.some(f => !f.question?.trim() || !f.answer?.trim());
    if (invalidFaqs) {
      setError('All FAQ questions and answers must be filled in before saving.');
      toast.error('All FAQ questions and answers must be filled in before saving.');
      return;
    }

    try {
      setError('');
      const serializedPlans = plans.map(({ icon, ...plan }) => plan);
      const sanitizedVideos = videos
        .map(({ file, previewUrl, fileName, ...video }) => ({
          ...video,
          url: video.url && isDirectVideoUrl(video.url) ? video.url : '',
        }))
        .filter((video) => video.title || video.url);

      // Save plans
      await axios.post('https://easybrand.onrender.com/api/page-data/plans', { plans: serializedPlans });
      
      // Save videos
      await axios.post('https://easybrand.onrender.com/api/page-data/videos', { videos: sanitizedVideos });
      
      // Save contact
      await axios.post('https://easybrand.onrender.com/api/page-data/contact', { contact });
      
      // Save FAQs
      await axios.post('https://easybrand.onrender.com/api/page-data/faqs', { faqs });

      toast.success('All data saved successfully');
    } catch (err) {
      console.error('Error saving data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save data to database. Please check your connection.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return <div className="p-4 sm:p-6 md:p-8"><p className="text-gray-600">Loading page data...</p></div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {error && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-700">{error}</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Content & Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Edit your plans, content, FAQs and contact info.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-black/90 text-white text-sm font-medium rounded-4xl px-5 py-2.5 self-start sm:self-auto shrink-0 hover:bg-black cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
        {CONTENT_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px transition-colors shrink-0 cursor-pointer ${
              tab === t ? 'text-violet-600 border-violet-600' : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Plans' && <PlansEditor plans={plans} setPlans={setPlans} selectedPlanId={selectedPlanId} setSelectedPlanId={setSelectedPlanId} />}
      {tab === 'Content' && <ContentEditor videos={videos} setVideos={setVideos} />}
      {tab === 'FAQs' && <FaqsEditor faqs={faqs} setFaqs={setFaqs} />}
      {tab === 'Contact' && <ContactInfoEditor contact={contact} setContact={setContact} />}
      <Toaster position="top-right" />
    </div>
  );
}

export default ContentPlansPage;
