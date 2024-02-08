import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import RQProvider from "@/app/components/RQProvider";
import { ShowsProvider } from "./components/ShowContext";
import { SyncActiveOrganization } from "./components/SyncActiveOrganization";

import { getShows, getVotes } from "@/db";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// const { orgId } = auth().protect();

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims, orgId } = auth();
  const shows = orgId ? await getShows(orgId) : []
  const votes = userId && orgId ? await getVotes(orgId, userId) : [];

  console.log(sessionClaims)

  return (
    <ClerkProvider>
      <SyncActiveOrganization 
        membership={sessionClaims?.membership} 
      />
      
      <html lang="en">
        <body className={`${inter.className} dark max-w-6xl mx-auto`}>
          <div className="bg-green-900 text-white mb-5 flex px-5 py-2 items-center rounded-b-lg">
            <div className="text-2xl font-bold flex-grow">Show Voter</div>
            <div>{userId && <UserButton afterSignOutUrl="/" />}</div>
          </div>
          <ShowsProvider shows={shows} votes={votes}>
            <RQProvider>{children}</RQProvider>
          </ShowsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
