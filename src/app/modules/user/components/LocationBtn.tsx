import { Location } from 'app/http/locations/location.model'
import React, { FC, useState } from 'react'

interface Props {
  locations: Location[]
  onClick: (loc: Location) => void
}

const ALL: Location = {
  id: -1,
  name: 'All',
}
const LocationBtn: FC<Props> = (props: Props) => {
  const [items, setItems] = useState({
    locations: [ALL, ...props.locations],
    selected: ALL,
  })

  return (
    <div className='flex w-full flex-wrap mb-3'>
      {items.locations.map((item, index) => (
        <div key={index}>
          <button
            className={`min-w-[100px] mr-2 p-2 rounded text-black font-medium h-full w-[340px] 
            md:w-auto text-left md:text-center
            ${items.selected === item ? 'bg-white text-green-500' : 'text-skin-muted'}`}
            onClick={() => {
              setItems((items) => ({
                ...items,
                selected: item,
              }))
              props.onClick(item)
            }}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export default LocationBtn
