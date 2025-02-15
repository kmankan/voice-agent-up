'use client';

import { useEffect } from 'react';

export const ConsoleLogger = () => {
  useEffect(() => {

    const asciiArt = `
███╗   ███╗ █████╗ ██╗  ██╗██╗     ███████╗███╗   ██╗    ╔██████╗ ███████╗██╗   ██╗
████╗ ████║██╔══██╗██║  ██║██║     ██╔════╝████╗  ██║    ║██╔══██╗██╔════╝██║   ██║
██╔████╔██║███████║███████║██║     █████╗  ██╔██╗ ██║    ║██║  ██║█████╗  ██║   ██║
██║╚██╔╝██║██╔══██║██╔══██║██║     ██╔══╝  ██║╚██╗██║    ║██║  ██║██╔══╝  ╚██╗ ██╔╝
██║ ╚═╝ ██║██║  ██║██║  ██║███████╗███████╗██║ ╚████║    ║██████╔╝███████╗ ╚████╔╝ 
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝ ██ ╚═════╝ ╚══════╝   ╚═══╝  
`;
    const showConsoleMessage = () => {
      console.clear();
      console.log(`${asciiArt}`);
      console.log(
        '%cMade with ❤️ by %cmahlen.dev%c',
        'color: #666; font-size: 14px;',
        'color: #ff6b6b; font-size: 14px; text-decoration: underline; cursor: pointer;',
        'color: #666; font-size: 14px;'
      );
    };

    showConsoleMessage();

    // // Optional: Detect DevTools opening
    // window.addEventListener('devtoolschange', event => {
    //   if (event.detail.isOpen) {
    //     showConsoleMessage();
    //   }
    // });

    // // Cleanup
    // return () => {
    //   window.removeEventListener('devtoolschange', event => {
    //     if (event.detail.isOpen) {
    //       showConsoleMessage();
    //     }
    //   });
    // };
  }, []);

  return null;
};