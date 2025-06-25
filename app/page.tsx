"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import L from "leaflet";
import Image from "next/image";
import flagImg from "@/assets/flag.png";
import manImg from "@/assets/man.png";
import womanImg from "@/assets/Woman.png";
import familyImg from "@/assets/family.png";
import dynamic from "next/dynamic";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
});

const dataJenjang = [
  { name: "Pertama", value: 40, fill: "#EF4444" },
  { name: "Muda", value: 80, fill: "#22C55E" },
  { name: "Madya", value: 60, fill: "#3B82F6" },
  { name: "Utama", value: 10, fill: "#8B5CF6" },
];

const unitKerjaList = [
  "Kementrian Agama",
  "Kementrian Dalam Negeri",
  "Kementrian Hukum dan HAM",
  "Kementrian Kesehatan",
  "Kementrian Luar Negeri",
  "Kementrian Pertahanan",
];

export default function Dashboard() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">
          Penyebaran Perancang di Indonesia
        </h1>

        <div className="flex items-center gap-3">
          {/* Dropdown */}
          <select className="border border-black rounded-lg px-4 py-2 text-gray-500 text-sm focus:outline-none focus:ring-1 ">
            <option>Pilih Provinsi</option>
            <option>Riau</option>
            <option>Balikpapan</option>
            <option>Jakarta</option>
          </select>

          {/* Tombol Unit Kerja */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-600"
              >
                <svg
                  className="w-4 h-4 mr-2 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L13 10.414V17a1 1 0 01-1.447.894l-4-2A1 1 0 017 15v-4.586L3.293 5.707A1 1 0 013 5V3z" />
                </svg>
                Unit Kerja
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] z-[9999]">
              <h4 className="text-sm font-medium mb-2">Filter Unit Kerja</h4>
              <Input placeholder="Cari Unit Kerja" className="mb-3" />
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  "Kementrian Hukum dan HAM",
                  "Kementrian Kesehatan",
                  "DPR",
                ].map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center bg-blue-200 text-blue-600 gap-1 pr-2"
                  >
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-gray-200"
                      onClick={() => console.log("hapus:", item)} // ganti nanti ke handle remove
                    >
                      X
                    </button>

                    {item}
                  </Badge>
                ))}
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {unitKerjaList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Checkbox id={`check-${idx}`} />
                    <label
                      htmlFor={`check-${idx}`}
                      className="text-sm text-gray-700"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Peta dan Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <MapView />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="grid gap-3">
          {/* KOORDINAT */}
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md flex items-center gap-4">
            <Image className="" src={flagImg} alt="flag" />
            <div>
              <div className="flex items-center gap-2 font-semibold text-lg text-black">
                Koordinat Wilayah
                <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-sm font-semibold">
                  Indonesia
                </span>
              </div>
              <p className="text-xl font-bold mt-1">(0.2933469, 101.7068294)</p>
            </div>
          </div>

          {/* POPULASI */}
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-black">
              Populasi Perancang
              <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-sm font-semibold">
                Indonesia
              </span>
            </div>
            <div className="flex justify-around items-center text-center">
              <div className="flex items-center">
                <Image className="" src={manImg} alt="flag" />
                <p className="text-2xl font-bold text-black mt-1">123</p>
              </div>
              <div className="flex items-center">
                <Image className="" src={womanImg} alt="flag" />
                <p className="text-2xl font-bold text-black mt-1">89</p>
              </div>
              <div className="flex items-center">
                <Image className="" src={familyImg} alt="flag" />
                <p className="text-2xl font-bold text-black mt-1">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* JENJANG */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-bold text-lg text-black mb-5">
            Jumlah Perancang per Jenjang
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataJenjang}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {dataJenjang.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
