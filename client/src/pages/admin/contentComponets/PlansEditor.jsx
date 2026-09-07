import { inputClass } from "../../../assets/mockdata";
import { useState } from "react";
import { Plus, X, CheckCircle2, Trash2, Copy, ChevronUp, ChevronDown, Zap, Edit2 } from "lucide-react";
import Field from "./Field";


const PlansEditor = ({ plans, setPlans, selectedPlanId, setSelectedPlanId }) => {
  const [newFeature, setNewFeature] = useState('');
  const [editingFeatureIndex, setEditingFeatureIndex] = useState(null);
  const [editingFeatureValue, setEditingFeatureValue] = useState('');
  const [errors, setErrors] = useState({});
  
  const plan = plans.find((p) => p.id === selectedPlanId) || plans[0] || null;

  const addNewPlan = () => {
    const newId = `plan-${Date.now()}`;
    const newPlan = {
      id: newId,
      name: 'New Plan',
      tagline: 'New plan tagline',
      icon: Zap,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      monthly: '0',
      yearly: '0',
      save: '0%',
      description: 'Plan description goes here',
      features: [],
    };
    setPlans((prev) => [...prev, newPlan]);
    setSelectedPlanId(newId);
  };

  if (!plan) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No Plans Yet</h3>
          <p className="text-sm text-gray-500 mb-6">Get started by creating your first plan.</p>
          <button
            onClick={addNewPlan}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-violet-700 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create First Plan
          </button>
        </div>
      </div>
    );
  }

  const validatePlan = () => {
    const newErrors = {};
    if (!plan.name?.trim()) newErrors.name = "Plan name is required";
    if (!plan.monthly || isNaN(plan.monthly)) newErrors.monthly = "Valid monthly price required";
    if (!plan.yearly || isNaN(plan.yearly)) newErrors.yearly = "Valid yearly price required";
    if (!plan.save || isNaN(plan.save.replace('%', ''))) newErrors.save = "Valid savings percentage required";
    if (plan.features.length === 0) newErrors.features = "At least one feature is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updatePlan = (field, value) => {
    setPlans((prev) => prev.map((p) => (p.id === selectedPlanId ? { ...p, [field]: value } : p)));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const removeFeature = (index) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanId ? { ...p, features: p.features.filter((_, i) => i !== index) } : p))
    );
  };

  const startEditFeature = (index, value) => {
    setEditingFeatureIndex(index);
    setEditingFeatureValue(value);
  };

  const saveFeatureEdit = (index) => {
    if (!editingFeatureValue.trim()) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanId ? { 
        ...p, 
        features: p.features.map((f, i) => i === index ? editingFeatureValue.trim() : f) 
      } : p))
    );
    setEditingFeatureIndex(null);
    setEditingFeatureValue('');
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanId ? { ...p, features: [...p.features, newFeature.trim()] } : p))
    );
    setNewFeature('');
  };

  const moveFeature = (index, direction) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPlanId) return p;
        const newFeatures = [...p.features];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
        return { ...p, features: newFeatures };
      })
    );
  };

  const deletePlan = () => {
    if (plans.length <= 1) {
      alert("You must keep at least one plan");
      return;
    }
    if (window.confirm(`Delete "${plan.name}"? This cannot be undone.`)) {
      setPlans((prev) => prev.filter((p) => p.id !== selectedPlanId));
      setSelectedPlanId(plans.find((p) => p.id !== selectedPlanId)?.id);
    }
  };

  const duplicatePlan = () => {
    const newId = `${plan.id}-copy-${Date.now()}`;
    const newPlan = {
      ...plan,
      id: newId,
      name: `${plan.name} (Copy)`,
    };
    setPlans((prev) => [...prev, newPlan]);
    setSelectedPlanId(newId);
  };





  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
      <div className="space-y-3">
        {plans.map((p) => {
          const Icon = p.icon;
          const active = p.id === selectedPlanId;
          return (
            <div
              key={p.id}
              className={`w-full flex items-center gap-2 rounded-xl border p-4 transition-colors group ${
                active ? 'border-violet-300 bg-violet-50' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <button
                onClick={() => setSelectedPlanId(p.id)}
                className="flex items-center gap-3 flex-1 text-left cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-lg ${p.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${p.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.tagline}</p>
                </div>
              </button>
              <button
                onClick={() => setSelectedPlanId(p.id)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-100 text-violet-600 shrink-0 cursor-pointer"
                title="Edit plan"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        <button
          onClick={addNewPlan}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-violet-200 p-4 text-violet-600 hover:border-violet-300 hover:bg-violet-50 transition-colors text-sm font-medium cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Plan
        </button>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6 cursor-default">
        <div className="flex items-center justify-between mb-5">
          <p className="font-medium text-gray-900">Edit {plan.name}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={duplicatePlan}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
              title="Duplicate plan"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={deletePlan}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
              title="Delete plan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Field label="Plan Name">
            <input 
              value={plan.name} 
              onChange={(e) => updatePlan('name', e.target.value)} 
              className={`${inputClass} ${errors.name ? 'border-red-300' : ''} cursor-text`} 
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </Field>
          <Field label="Tagline">
            <input value={plan.tagline} onChange={(e) => updatePlan('tagline', e.target.value)} className={`${inputClass} cursor-text`} />
          </Field>
        </div>

        <div className="mb-4">
          <Field label="Description">
            <textarea
              value={plan.description}
              onChange={(e) => updatePlan('description', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none cursor-text`}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <Field label="Monthly Price (USD)">
            <input 
              value={plan.monthly} 
              onChange={(e) => updatePlan('monthly', e.target.value)} 
              className={`${inputClass} ${errors.monthly ? 'border-red-300' : ''} cursor-text`}
              type="number"
            />
            {errors.monthly && <p className="text-xs text-red-500 mt-1">{errors.monthly}</p>}
          </Field>
          <Field label="Yearly Price (USD)">
            <input 
              value={plan.yearly} 
              onChange={(e) => updatePlan('yearly', e.target.value)} 
              className={`${inputClass} ${errors.yearly ? 'border-red-300' : ''} cursor-text`}
              type="number"
            />
            {errors.yearly && <p className="text-xs text-red-500 mt-1">{errors.yearly}</p>}
          </Field>
          <Field label="Savings (%)">
            <input 
              value={plan.save} 
              onChange={(e) => updatePlan('save', e.target.value)} 
              className={`${inputClass} ${errors.save ? 'border-red-300' : ''} cursor-text`}
              placeholder="e.g., 17%"
            />
            {errors.save && <p className="text-xs text-red-500 mt-1">{errors.save}</p>}
          </Field>
        </div>

        <p className="text-xs text-gray-500 mb-2 font-medium">Features {errors.features && <span className="text-red-500">{errors.features}</span>}</p>
        <div className="space-y-2 mb-3">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 group hover:bg-gray-50">
              {editingFeatureIndex === i ? (
                <input
                  value={editingFeatureValue}
                  onChange={(e) => setEditingFeatureValue(e.target.value)}
                  onBlur={() => saveFeatureEdit(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveFeatureEdit(i);
                    if (e.key === 'Escape') setEditingFeatureIndex(null);
                  }}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 cursor-text"
                />
              ) : (
                <span 
                  onClick={() => startEditFeature(i, f)}
                  className="text-sm text-gray-700 flex-1 cursor-pointer hover:text-gray-900"
                >
                  {f}
                </span>
              )}
              <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {i > 0 && (
                  <button
                    onClick={() => moveFeature(i, 'up')}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 cursor-pointer"
                    title="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                )}
                {i < plan.features.length - 1 && (
                  <button
                    onClick={() => moveFeature(i, 'down')}
                    className="p-1 hover:bg-gray-200 rounded text-gray-500 cursor-pointer"
                    title="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                )}
                <button 
                  onClick={() => removeFeature(i)}
                  className="p-1 hover:bg-red-100 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addFeature()}
            placeholder="Add a feature..."
            className={`flex-1 min-w-[140px] ${inputClass} cursor-text`}
          />
          <button onClick={addFeature} className="flex items-center gap-1 text-sm text-violet-600 font-medium shrink-0 px-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>

        <button 
          onClick={validatePlan}
          className="w-full bg-violet-600 text-white rounded-lg px-4 py-2 font-medium text-sm hover:bg-violet-700 transition-colors cursor-pointer"
        >
          Validate & Save
        </button>
        {Object.keys(errors).length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-medium text-red-800 mb-1">Please fix the following errors:</p>
            <ul className="text-xs text-red-700 space-y-0.5">
              {Object.values(errors).filter(e => e).map((err, i) => <li key={i}>• {err}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-5">
          <p className="text-xs font-medium text-violet-600 mb-4">Plan Preview</p>
          {(() => {
            const IconPreview = plan.icon;
            if (!IconPreview) {
              return null;
            }

            return (
              <div className={`w-10 h-10 rounded-lg ${plan.iconBg} flex items-center justify-center mb-3`}>
                <IconPreview className={`w-5 h-5 ${plan.iconColor}`} />
              </div>
            );
          })()}
          <p className="font-semibold text-gray-900">{plan.name}</p>
          <p className="text-xs text-gray-500 mb-3">{plan.tagline}</p>
          <p className="text-2xl font-semibold text-gray-900 mb-4">
            ${plan.monthly}<span className="text-sm font-normal text-gray-400">/month</span>
          </p>
          <div className="space-y-2">
            {plan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlansEditor;