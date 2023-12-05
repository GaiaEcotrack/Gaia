

const Button: React.FC = () => {
  const handleClick = () => {
  };

  return (
    <div className="flex flex-col items-center mt-16">
      <button
        className="bg-[#74C7ED] text-white py-2 px-4 rounded w-1/2"
        onClick={handleClick}
      >
        Aplicar
      </button>
    </div>
  );
};

export default Button;
