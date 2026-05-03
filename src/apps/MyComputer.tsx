import React from 'react'
import * as Icons from 'lucide-react'

export default function MyComputer() {
  const drives = [
    { name: 'Local Disk (C:)', icon: 'HardDrive', total: '2.0 GB', used: '1.2 GB', free: '800 MB', percent: 60 },
    { name: 'Virtual Drive (D:)', icon: 'Disc', total: '640 MB', used: '256 MB', free: '384 MB', percent: 40 }
  ]

  const info = [
    { label: 'Computer Name', value: 'DEV98-PC' },
    { label: 'Operating System', value: 'Dev98 WebOS v1.0' },
    { label: 'Edition', value: 'Solarpunk Edition' },
    { label: 'Processor', value: 'Browser Engine v1.0' },
    { label: 'Memory (RAM)', value: '128 MB (Virtual)' },
    { label: 'Display', value: window.innerWidth + 'x' + window.innerHeight },
    { label: 'Build', value: '2026.05.02' },
    { label: 'Platform', value: navigator.platform },
    { label: 'User Agent', value: navigator.userAgent.slice(0, 60) + '...' }
  ]

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">

      <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] p-3 flex items-center gap-3">
        <Icons.Monitor size={32} className="text-white" />
        <div>
          <div className="text-white font-bold text-[14px]">My Computer</div>
          <div className="text-[#a0c0ff] text-[11px]">View system information and storage</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">

        <div className="win98-border-raised p-2">
          <div className="text-[12px] font-bold mb-2 flex items-center gap-1">
            <Icons.HardDrive size={14} />
            Storage Devices
          </div>

          {drives.map((d, i) => {
            const IconComp = (Icons as any)[d.icon] || Icons.HardDrive

            return (
              <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                <IconComp size={32} className="text-[#808080] shrink-0" />

                <div className="flex-1">
                  <div className="text-[11px] font-bold">{d.name}</div>

                  <div className="win98-progress w-full mt-1">
                    <div
                      className="h-full"
                      style={{
                        width: d.percent + '%',
                        backgroundColor: d.percent > 80 ? '#ff0000' : '#000080'
                      }}
                    />
                  </div>

                  <div className="text-[10px] text-[#808080] mt-[2px]">
                    {d.used} used / {d.total} total ({d.free} free)
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="win98-border-raised p-2">
          <div className="text-[12px] font-bold mb-2 flex items-center gap-1">
            <Icons.Cpu size={14} />
            System Information
          </div>

          <table className="w-full text-[11px]">
            <tbody>
              {info.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f0f0f0]'}>
                  <td className="px-2 py-[3px] font-bold w-[140px] border border-[#dfdfdf]">
                    {row.label}
                  </td>
                  <td className="px-2 py-[3px] border border-[#dfdfdf]">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="win98-border-raised p-3 text-center">
          <div className="text-[16px] font-bold font-pixel text-[#000080]">Dev98</div>
          <div className="text-[11px] text-[#2d5a27]">Solarpunk Edition</div>

          <div className="text-[10px] text-[#808080] mt-1">
            Licensed to: Hackathon 2026
          </div>

          <div className="text-[10px] text-[#808080]">
            Built with React + TailwindCSS
          </div>
        </div>

      </div>
    </div>
  )
}
