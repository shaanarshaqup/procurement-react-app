import React, { useState } from 'react';
import TextField from '../../basic_components/TextField';
import { IModalProps } from '../../../types/commonTypes';
import { notification } from 'antd';
import { Loader2 } from 'lucide-react';
import { ICategory } from '../../../types/categoryTypes';
import { createOrUpdateCategoryAsync } from '../../../services/categoryService';

interface FormErrors {
  name?: string;
  description?: string;
}

interface ICreateCategoryForm extends IModalProps {
  type?: 'edit' | 'create';
  category: ICategory;
  trigger: () => void;
}

const CreateCategoryForm: React.FC<ICreateCategoryForm> = ({ type = 'create', category, trigger, closeModal }) => {
  const [formData, setFormData] = useState<ICategory>(
    type === 'create'
      ? {
          id: 0,
          name: '',
          description: '',
          clientId: 0,
          createdAt: new Date().toISOString(),
          createdBy: 0,
          updatedAt: new Date().toISOString(),
          updatedBy: 0,
          isdeleted: false,
          deletedBy: 0,
          tenantId: 0,
          companyId: 0,
          branchId: 0
        }
      : category
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name) {
        setErrors((prev) => ({ ...prev, name: 'Category name is required' }));
        return;
      }

      if (!/^[a-zA-Z0-9 ]+$/.test(formData.name)) {
        setErrors((prev) => ({
          ...prev,
          name: 'Category name must not contain special characters'
        }));
        return;
      }

      if (!formData.description) {
        setErrors((prev) => ({ ...prev, description: 'Description is required' }));
        return;
      }

      const payload = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: 1 // Replace with actual user ID if available
      };

      await createOrUpdateCategoryAsync(payload);

      notification.success({
        message: `Category ${type === 'edit' ? 'updated' : 'created'} successfully`
      });

      closeModal();
      trigger();
    } catch (err: any) {
      notification.error({
        message: 'Error',
        description: err?.message || 'Failed to submit form'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b">
        <p className="text-xl font-bold">{type === 'create' ? 'Add new category' : 'Edit category'}</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-2">
            Category Name <span className="text-red-500">*</span>
          </label>
          <TextField
            id="name"
            field="Category Name"
            value={formData.name}
            setValue={(value) => setFormData((prev) => ({ ...prev, name: value }))}
            placeholder="Enter category name"
            type="text"
            width="w-full"
            onFocus={() => setErrors((prev) => ({ ...prev, name: '' }))}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <TextField
            id="description"
            field="Description"
            value={formData.description}
            setValue={(value) => setFormData((prev) => ({ ...prev, description: value }))}
            placeholder="Enter description"
            type="text"
            width="w-full"
            onFocus={() => setErrors((prev) => ({ ...prev, description: '' }))}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 border-t bg-white p-4 mt-auto">
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-sm text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : type === 'edit' ? 'Update' : 'Submit'}
          </button>
          <button
            onClick={closeModal}
            type="button"
            className="px-4 py-2 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateCategoryForm;
