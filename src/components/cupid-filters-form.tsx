import { Switch } from './ui/switch';

export const FiltersForm = () => {
  return (
    <div className="text-primary p-6 font-bold w-full h-full">
      <h1 className='text-lg text-center'>Narrow your search</h1>
      <div className="flex items-center space-x-2">
        <Switch  />
      </div>
    </div>
  );
};
