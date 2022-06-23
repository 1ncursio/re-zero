import { AiFillGithub } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="h-full flex flex-col justify-end items-center py-4">
      <a href="https://github.com/1ncursio" target="_blank" rel="noopener noreferrer">
        <AiFillGithub size={32} className="text-blueGray-100" />
      </a>
      <span className="text-blueGray-400 text-sm">&copy; {new Date().getFullYear()}. 1ncursio</span>
    </div>
  );
};

export default Footer;
