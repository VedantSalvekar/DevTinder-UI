import React from "react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300">
      <div>
        <p className="text-sm text-[#c9d1d9]">
          GitTogether • © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
