import React, { useState } from 'react'
import { FILE_SYSTEM } from '../data/apps'
import { FileSystemNode } from '../types'
import * as Icons from 'lucide-react'

function findNode(path: string[], fs: FileSystemNode): FileSystemNode | null {
  let current = fs

  for (const part of path) {
    if (current.type !== 'folder' || !current.children) return null
    const child = current.children.find(c => c.name === part)
    if (!child) return null
    current = child
  }

  return current
}

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'icons'>('list')

  const currentNode = findNode(currentPath, FILE_SYSTEM)
  const children = currentNode?.children || []

  const navigateTo = (name: string) => {
    const child = children.find(c => c.name === name)
    if (child?.type === 'folder') {
      setCurrentPath([...currentPath, name])
      setSelectedItem(null)
    }
  }

  const navigateUp = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1))
      setSelectedItem(null)
    }
  }

  const pathString = 'C:\\' + currentPath.join('\\')

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]">

      <div className="flex text-[11px] border-b border-b-[#808080] px-1">
        <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer">File</span>
        <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer">Edit</span>
        <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer">View</span>
        <span className="px-2 py-[2px] hover:bg-[#000080] hover:text-white cursor-pointer">Help</span>
      </div>

      <div className="flex items-center gap-1 p-1 border-b border-b-[#808080]">
        <button
          className="win98-btn text-[11px] h-[22px] min-w-0 px-2"
          onClick={navigateUp}
          disabled={currentPath.length === 0}
        >
          <Icons.ArrowUp size={12} />
        </button>

        <div className="win98-border-field bg-white flex-1 h-[20px] flex items-center px-2">
          <span className="text-[11px]">{pathString}</span>
        </div>

        <button
          className={`win98-btn text-[11px] h-[22px] min-w-0 px-2 ${
            viewMode === 'list' ? 'border-[#404040] border-r-white border-b-white' : ''
          }`}
          onClick={() => setViewMode('list')}
        >
          <Icons.List size={12} />
        </button>

        <button
          className={`win98-btn text-[11px] h-[22px] min-w-0 px-2 ${
            viewMode === 'icons' ? 'border-[#404040] border-r-white border-b-white' : ''
          }`}
          onClick={() => setViewMode('icons')}
        >
          <Icons.LayoutGrid size={12} />
        </button>
      </div>

      <div className="flex flex-1 min-h-0">

        <div className="w-[140px] border-r border-r-[#808080] overflow-auto">
          <div className="p-1">
            <div
              className={`flex items-center gap-1 text-[11px] px-1 py-[2px] cursor-pointer ${
                currentPath.length === 0
                  ? 'bg-[#000080] text-white'
                  : 'hover:bg-[#dfdfdf]'
              }`}
              onClick={() => {
                setCurrentPath([])
                setSelectedItem(null)
              }}
            >
              <Icons.HardDrive size={12} />
              <span>C:</span>
            </div>

            {FILE_SYSTEM.children?.map(child => (
              <div key={child.name}>
                <div
                  className={`flex items-center gap-1 text-[11px] px-1 py-[2px] pl-4 cursor-pointer ${
                    currentPath.length === 1 && currentPath[0] === child.name
                      ? 'bg-[#000080] text-white'
                      : 'hover:bg-[#dfdfdf]'
                  }`}
                  onClick={() => {
                    if (child.type === 'folder') {
                      setCurrentPath([child.name])
                      setSelectedItem(null)
                    }
                  }}
                >
                  <Icons.Folder size={12} className="text-[#c6a84b]" />
                  <span className="truncate">{child.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white overflow-auto">
          {viewMode === 'list' ? (
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-[#c0c0c0] border-b border-b-[#808080]">
                  <th className="text-left px-2 py-1 font-normal border-r border-r-white">Name</th>
                  <th className="text-left px-2 py-1 font-normal border-r border-r-white w-[60px]">Size</th>
                  <th className="text-left px-2 py-1 font-normal border-r border-r-white w-[60px]">Type</th>
                  <th className="text-left px-2 py-1 font-normal w-[80px]">Modified</th>
                </tr>
              </thead>

              <tbody>
                {currentPath.length > 0 && (
                  <tr
                    className="hover:bg-[#000080] hover:text-white cursor-pointer"
                    onDoubleClick={navigateUp}
                  >
                    <td className="px-2 py-[2px] flex items-center gap-1">
                      <Icons.FolderUp size={14} className="text-[#c6a84b]" />
                      <span>..</span>
                    </td>
                    <td className="px-2 py-[2px]"></td>
                    <td className="px-2 py-[2px]">Folder</td>
                    <td className="px-2 py-[2px]"></td>
                  </tr>
                )}

                {children.map(child => (
                  <tr
                    key={child.name}
                    className={`cursor-pointer ${
                      selectedItem === child.name
                        ? 'bg-[#000080] text-white'
                        : 'hover:bg-[#e8e8e8]'
                    }`}
                    onClick={() => setSelectedItem(child.name)}
                    onDoubleClick={() => navigateTo(child.name)}
                  >
                    <td className="px-2 py-[2px] flex items-center gap-1">
                      {child.type === 'folder' ? (
                        <Icons.Folder size={14} className="text-[#c6a84b] shrink-0" />
                      ) : (
                        <Icons.FileText size={14} className="text-[#808080] shrink-0" />
                      )}
                      <span className="truncate">{child.name}</span>
                    </td>

                    <td className="px-2 py-[2px]">{child.size || ''}</td>
                    <td className="px-2 py-[2px]">
                      {child.type === 'folder' ? 'Folder' : 'File'}
                    </td>
                    <td className="px-2 py-[2px]">{child.modified || ''}</td>
                  </tr>
                ))}

                {children.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-2 py-4 text-center text-[#808080]">
                      (Empty folder)
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-wrap gap-2 p-2">

              {currentPath.length > 0 && (
                <div
                  className="w-[72px] flex flex-col items-center gap-1 p-1 cursor-pointer hover:bg-[#e8e8e8]"
                  onDoubleClick={navigateUp}
                >
                  <Icons.FolderUp size={32} className="text-[#c6a84b]" />
                  <span className="text-[11px] text-center">..</span>
                </div>
              )}

              {children.map(child => (
                <div
                  key={child.name}
                  className={`w-[72px] flex flex-col items-center gap-1 p-1 cursor-pointer ${
                    selectedItem === child.name
                      ? 'bg-[#000080] text-white'
                      : 'hover:bg-[#e8e8e8]'
                  }`}
                  onClick={() => setSelectedItem(child.name)}
                  onDoubleClick={() => navigateTo(child.name)}
                >
                  {child.type === 'folder' ? (
                    <Icons.Folder size={32} className="text-[#c6a84b]" />
                  ) : (
                    <Icons.FileText size={32} className="text-[#808080]" />
                  )}
                  <span className="text-[11px] text-center truncate w-full">
                    {child.name}
                  </span>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>

      <div className="flex items-center h-[20px] border-t-2 border-t-[#808080] text-[10px] px-1">
        <div className="flex-1 win98-border-sunken px-2 h-[16px] flex items-center">
          {children.length} object(s)
        </div>
        <div className="win98-border-sunken px-2 h-[16px] flex items-center ml-1">
          {selectedItem || 'No selection'}
        </div>
      </div>

    </div>
  )
}
