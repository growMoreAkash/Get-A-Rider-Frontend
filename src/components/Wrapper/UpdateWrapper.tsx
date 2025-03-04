import React from 'react';

const UpdateWrapper = ({ columns, setRenderComponent, renderComponent }: any) => {
    return (
        <div>
            {columns.map((item: any, index: any) => (
                <div className="pb-5" key={index}>
                    <div
                        role="button"
                        onClick={() => setRenderComponent(item)}
                        className={`rounded-md w-48 h-10 text-center flex items-center justify-center font-semibold text-md cursor-pointer shadow-md 
                            ${renderComponent === item ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                    >
                        {item}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpdateWrapper;
