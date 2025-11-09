// 📄 src/components/HostelPage.jsx
import React, { useState } from "react";
import HostelHeader from "./HostelHeader";
import RoomsList from "./RoomList";

export default function HostelPage() {
  const [sortOption, setSortOption] = useState("Recommended");

  return (
    <div>
      <HostelHeader sortOption={sortOption} onSortChange={setSortOption} />
      <RoomsList sortOption={sortOption} />
    </div>
  );
}
