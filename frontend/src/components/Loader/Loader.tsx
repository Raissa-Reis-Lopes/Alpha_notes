import './Loader.css';

interface LoaderProps {
  className?: string;
  title?: string;
}

const Loader: React.FC<LoaderProps> = ({ className, title, ...props }) => {
  return (
    <div className={`${className} loader`} title={title}></div>
  );
};

export default Loader;
