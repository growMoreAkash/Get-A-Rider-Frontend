import { Controller } from "react-hook-form";

interface DropdownItem {
    name: string;
}

interface ReusableDropdownProps {
    item: string;
    options: DropdownItem[];
    control: any;
    name: string;
    disabled?: boolean;
}

const OwnerReusableDropdownList = ({ item, options = [], control, name, disabled = false }: ReusableDropdownProps) => {
    //////.log(options, 'owner ka options');
    return (
        <div className="w-[83%]">
            <div className="mb-2">
                <label htmlFor={name}>{item}</label>
                <Controller
                    name={name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <select id={name} className="form-input" {...field} disabled={disabled}>
                            <option value="">{`Select ${item}`}</option>
                            {options.map((option: any) => (
                                <option key={option._id} value={option.ownerId}>
                                    {option.ownerPhone} {option.ownerName ? ` (${option.ownerName}) ` : ""} 
                                </option>
                            ))}
                        </select>
                    )}
                />
            </div>
        </div>
    );
};

export default OwnerReusableDropdownList;