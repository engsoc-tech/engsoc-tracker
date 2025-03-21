import { Lato } from "next/font/google";

//WHEN WE HAVE ACCESS TO THE PAID ROC-GROTESK FONT
// import localFont from "next/font/local";
// const rocGrotesk = localFont({
//     src: "./fonts/GeistVF.woff",
//     variable: "--font-geist-sans",
//     weight: "100 900",
//   });
// export const mainFont = rocGrotesk;

export const giest = Lato({
    weight: ['400', '700'],
    style: 'normal',
    subsets: ['latin'],
    // display: 'swap', 
})

export const mainFont = giest;