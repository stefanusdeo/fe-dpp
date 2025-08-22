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
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { url } from "@/lib/api/dashboard";
import { ApiResponse } from "@/types/apiType";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import flagImg from "@/assets/flag.png";
import manImg from "@/assets/man.png";
import womanImg from "@/assets/Woman.png";
import familyImg from "@/assets/family.png";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const dataJenjang = [
  { name: "Pertama", value: 0, fill: "#EF4444" },
  { name: "Muda", value: 0, fill: "#22C55E" },
  { name: "Madya", value: 0, fill: "#3B82F6" },
  { name: "Utama", value: 0, fill: "#8B5CF6" },
];

// TYPES
type Province = {
  id: number;
  nama: string;
  latitude: string;
  longitude: string;
};
type UnitKerja = { id: number; nama: string };
type Population = {
  total_perancang: number;
  total_perancang_pria: number;
  total_perancang_wanita: number;
};
type Perancang = { jumlah_perancang: number; jenjang_perancang: string };

// MAIN
export default function Dashboard() {
  const [province, setProvince] = useState<Province[]>([]);
  const [unitKerjaList, setUnitKerjaList] = useState<UnitKerja[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

  const [population, setPopulation] = useState<Population | null>(null);
  const [perancang, setPerancang] = useState<Perancang[]>([]);
  const [keyword, setSetKeyword] = useState<string>("");

  const fetchDashboardData = useCallback(async () => {
    try {
      const buildUrl = (base: string) => {
        const apiUrl = new URL(base);
        if (selectedProvince)
          apiUrl.searchParams.set("provinsi_id", selectedProvince.toString());
        if (selectedUnits.length > 0)
          apiUrl.searchParams.set("unit_kerja_id", selectedUnits.join(","));
        return apiUrl.toString();
      };

      const [popResp, perJenjangResp] = await Promise.all([
        fetch(buildUrl(url.populasiPerancang)),
        fetch(buildUrl(url.perancangPerjenjang)),
      ]);

      const popData: ApiResponse<any> = await popResp.json();
      const jenjangData: ApiResponse<any> = await perJenjangResp.json();

      setPopulation(popResp.status === 200 ? popData?.Data : null);
      setPerancang(
        perJenjangResp.status === 200 ? jenjangData?.Data ?? [] : []
      );
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  }, [selectedProvince, selectedUnits]);

  useEffect(() => {
    fetchDashboardData(); // initial fetch
  }, []);

  // debounce fetch saat filter berubah
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDashboardData();
    }, 2000);
    return () => clearTimeout(handler);
  }, [fetchDashboardData]);

  const fetchInitialData = async () => {
    try {
      const [provRes, unitRes] = await Promise.all([
        fetch(url.dashboardProvinsi),
        fetch(url.unitKerja),
      ]);
      const provData: ApiResponse<any> = await provRes.json();
      const unitData: ApiResponse<any> = await unitRes.json();
      setProvince(Array.isArray(provData?.Data) ? provData.Data : []);
      setUnitKerjaList(Array.isArray(unitData?.Data) ? unitData.Data : []);
    } catch (err) {
      console.error("Error fetching init data", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleToggleUnit = useCallback((id: string) => {
    setSelectedUnits((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const mergedData = useMemo(() => {
    return dataJenjang.map((item) => {
      const found = perancang.find(
        (p) => p.jenjang_perancang.toLowerCase() === item.name.toLowerCase()
      );
      return { ...item, value: found?.jumlah_perancang ?? 0 };
    });
  }, [perancang]);

  const dataProvSelected = useMemo(() => {
    return province.find((p) => p.id === selectedProvince);
  }, [selectedProvince, province]);

  const getFilterUnitKerja = useMemo(() => {
    return unitKerjaList.filter((unit) =>
      unit.nama.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [unitKerjaList, keyword]);

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-black">
          Penyebaran Perancang di Indonesia
        </h1>

        <div className="flex items-center gap-3">
          <select
            className="border border-black rounded-lg px-4 py-2 text-sm text-gray-500"
            onChange={(e) => {
              setSelectedProvince(parseInt(e.target.value));
              setSelectedUnits([]);
            }}
          >
            <option>Pilih Provinsi</option>
            {province.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.nama}
              </option>
            ))}
          </select>

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
            <PopoverContent className="w-[350px] right-1 z-[9999]">
              <h4 className="text-sm font-medium mb-2">Filter Unit Kerja</h4>
              <Input
                placeholder="Cari Unit Kerja"
                className="mb-3"
                onChange={(e) => setSetKeyword(e.target.value)}
              />
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedUnits.map((unitId) => {
                  const unit = unitKerjaList.find(
                    (u) => u.id.toString() === unitId
                  );
                  return (
                    <Badge
                      key={unitId}
                      variant="secondary"
                      className="flex items-center bg-blue-200 text-blue-600 gap-1 pr-2"
                    >
                      <span className="truncate">{unit?.nama || unitId}</span>
                      <button onClick={() => handleToggleUnit(unitId)}>
                        X
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {getFilterUnitKerja.map((unit, idx) => (
                  <div key={unit.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`check-${unit.id}`}
                      checked={selectedUnits.includes(unit.id.toString())}
                      onCheckedChange={() =>
                        handleToggleUnit(unit.id.toString())
                      }
                    />
                    <label
                      htmlFor={`check-${unit.id}`}
                      className="text-sm text-gray-700"
                    >
                      {unit.nama}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* MAP */}
      <div className="bg-white rounded-lg shadow p-4">
        <MapView data={dataProvSelected ? [dataProvSelected] : province} />
      </div>

      {/* INFO BOXES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* LEFT */}
        <div className="grid gap-3">
          {/* Koordinat */}
          <InfoBox
            title="Koordinat Wilayah"
            subtitle="Indonesia"
            value={`(${dataProvSelected?.latitude || 0} , ${
              dataProvSelected?.longitude || 0
            })`}
            icon={flagImg}
          />
          {/* Populasi */}
          <div className="bg-white px-6 py-4 rounded-2xl shadow-md space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg text-black">
              Populasi Perancang
              <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-sm font-semibold">
                Indonesia
              </span>
            </div>
            <div className="flex justify-around items-center text-center">
              <PopBox icon={manImg} value={population?.total_perancang || 0} />
              <PopBox
                icon={womanImg}
                value={population?.total_perancang_wanita || 0}
              />
              <PopBox
                icon={familyImg}
                value={population?.total_perancang_pria || 0}
              />
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="font-bold text-lg text-black mb-5">
            Jumlah Perancang per Jenjang
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mergedData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {mergedData.map((entry, index) => (
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

// Komponen bantu kecil (opsional)
function InfoBox({
  title,
  subtitle,
  value,
  icon,
}: {
  title: string;
  subtitle: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="bg-white px-6 py-4 rounded-2xl shadow-md flex items-center gap-4">
      <Image src={icon} alt="icon" />
      <div>
        <div className="flex items-center gap-2 font-semibold text-lg text-black">
          {title}
          <span className="bg-red-500 text-white px-3 py-0.5 rounded-full text-sm font-semibold">
            {subtitle}
          </span>
        </div>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

function PopBox({ icon, value }: { icon: any; value: number }) {
  return (
    <div className="flex items-center">
      <Image src={icon} alt="icon" />
      <p className="text-2xl font-bold text-black mt-1">{value}</p>
    </div>
  );
}
