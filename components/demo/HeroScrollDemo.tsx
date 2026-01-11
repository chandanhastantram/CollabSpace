"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Collaborate in{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Real-Time
              </span>
              <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                CollabSpace
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
              Experience seamless team collaboration with live document editing,
              instant presence tracking, and powerful workspace management.
            </p>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&h=720&fit=crop"
          alt="Team Collaboration Workspace"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
