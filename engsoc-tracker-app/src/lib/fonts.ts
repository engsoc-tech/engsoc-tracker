import { Geist } from "next/font/google";

//WHEN WE HAVE ACCESS TO THE PAID ROC-GROTESK FONT
// import localFont from "next/font/local";
// const rocGrotesk = localFont({
//     src: "./fonts/GeistVF.woff",
//     variable: "--font-geist-sans",
//     weight: "100 900",
//   });
// export const mainFont = rocGrotesk;

export const giest = Geist({
    weight: 'variable',
    style: 'normal',
    subsets: ['latin'],
    // display: 'swap', 
})

export const mainFont = giest;