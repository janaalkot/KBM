import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ReviewSummaryCard } from '../components/lessons/ReviewSummaryCard';

import type {
  Department,
  Function,
  Industry,
  CreateLessonDto,
} from '../types';

import {
  LessonService,
  getErrorMessage,
} from '../services/api';

const EMPTY_FORM: CreateLessonDto = {
  title: '',
  projectName: '',
  departmentId: '',
  functionId: '',
  industryId: '',
  valueProposition: '',
  description: '',
  imageUrl: '',
  personToContact: '',
};

export const CreateLessonPage: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);

  const [formData, setFormData] =
    useState<CreateLessonDto>(EMPTY_FORM);

  const [isLoadingLookups, setIsLoadingLookups] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    const loadLookups = async () => {
      setIsLoadingLookups(true);
      setError('');

      try {
        const [
          departmentsData,
          functionsData,
          industriesData,
        ] = await Promise.all([
          LessonService.getDepartments(),
          LessonService.getFunctions(),
          LessonService.getIndustries(),
        ]);

        setDepartments(departmentsData);
        setFunctions(functionsData);
        setIndustries(industriesData);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoadingLookups(false);
      }
    };

    loadLookups();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError('');

    if (!formData.departmentId || !formData.functionId ||!formData.industryId) {
      setError('Please select a department, function, and industry.');

      return;
    }

    setIsSubmitting(true);

    try {
      await LessonService.createLesson(formData);

      navigate('/lessons', {replace: true,});
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIndustry =industries.find((item) => item.id === formData.industryId )?.name || '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: 'Create Lesson' }]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Create Lesson
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Document a lesson learned and make it available
          to the engineering team.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {isLoadingLookups ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-[#0b1623]">
          Loading form data...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 lg:col-span-2"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1623]">
              <h2 className="mb-6 text-base font-bold text-slate-900 dark:text-white">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Lesson Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter lesson title"
                  required
                />

                <Field
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  required
                />

                <SelectField
                  label="Department"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  options={departments}
                  placeholder="Select department"
                  required
                />

                <SelectField
                  label="Function"
                  name="functionId"
                  value={formData.functionId}
                  onChange={handleChange}
                  options={functions}
                  placeholder="Select function"
                  required
                />

                <div className="sm:col-span-2">
                  <SelectField
                    label="Industry"
                    name="industryId"
                    value={formData.industryId}
                    onChange={handleChange}
                    options={industries}
                    placeholder="Select industry"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1623]">
              <h2 className="mb-6 text-base font-bold text-slate-900 dark:text-white">
                Lesson Content
              </h2>

              <TextAreaField
                label="Value Proposition"
                name="valueProposition"
                value={formData.valueProposition}
                onChange={handleChange}
                placeholder="What is the main lesson learned?"
                rows={4}
                required
              />

              <div className="mt-5">
                <TextAreaField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the problem, solution, and important takeaways..."
                  rows={9}
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0b1623]">
              <h2 className="mb-6 text-base font-bold text-slate-900 dark:text-white">
                Additional Information
              </h2>

              <Field  label="Person to Contact"  name="personToContact"  value={formData.personToContact || ''}  onChange={handleChange}  placeholder="Optional" />

              <div className="mt-5">
                <Field  label="Image URL"  name="imageUrl"  type="url"  value={formData.imageUrl || ''}  onChange={handleChange}  placeholder="Optional"  />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800">
              <button  type="button" onClick={() => navigate('/lessons')} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" >
                Cancel
              </button>

              <button
                type="submit" disabled={isSubmitting} className="rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting? 'Creating...' : 'Create Lesson'}
              </button>
            </div>
          </form>

          <ReviewSummaryCard
            title={formData.title}
            projectName={formData.projectName}
            industry={selectedIndustry}
            description={formData.description}
          />
        </div>
      )}
    </div>
  );
};

interface FieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}

const Field: React.FC<FieldProps> = ({label,name,value,onChange,placeholder,type = 'text',required = false,}) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label} {required && '*'}
    </label>

    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#07101a] dark:text-white"
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  options: Array<{ id: string; name: string }>;
  placeholder: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({label,name,value,onChange,options,placeholder,required = false,}) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label} {required && '*'}
    </label>

    <select
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#07101a] dark:text-white"
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  rows: number;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({label,name,value,onChange,placeholder,rows,required = false,}) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label} {required && '*'}
    </label>

    <textarea
      name={name}
      required={required}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-[#07101a] dark:text-white"
    />
  </div>
);