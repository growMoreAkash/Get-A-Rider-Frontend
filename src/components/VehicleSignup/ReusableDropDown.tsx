import { Controller } from 'react-hook-form';

interface DropdownItem {
  name: string;
}

interface ReusableDropdownProps {
  item: string;
  oldValue: string;
  options: DropdownItem[];
  control: any;
  name: string;
  disabled?: boolean;
}

const ReusableDropdown = ({ item, oldValue, options = [], control, name, disabled = false }: ReusableDropdownProps) => {
  const filteredOptions = options.filter(e => e.name !== oldValue);

  return (
    <div className="w-[83%]">
      <div className="mb-2">
        <label htmlFor={name}>{item}</label>
        <Controller
          name={name}
          control={control}
          defaultValue={oldValue || ''} // Use oldValue as the default
          render={({ field }) => (
            <select id={name} className="form-input " {...field} disabled={disabled}>
              <option value="">{oldValue || `Select ${item}`}</option>
              {filteredOptions.map((option: any) => (
                <option key={option._id} value={option._id} className=''>
                  {option.name}{option.fullName ? ` (${option.fullName})` : ''}
                </option>
              ))}
            </select>
          )}
        />
      </div>
    </div>
  );
};

export default ReusableDropdown;
