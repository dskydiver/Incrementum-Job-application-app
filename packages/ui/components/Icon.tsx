import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { SvgIcon, SxProps } from '@mui/material'
import React from 'react'

type IconProps = {
  icon: IconDefinition
  sx?: SxProps
}

export default React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon, sx }, ref) => {
    const {
      icon: [width, height, , , svgPathData],
    } = icon

    return (
      <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`} sx={sx}>
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          /**
           * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
           * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
           * of a duotone icon. 40% is the default opacity.
           *
           * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
           */
          svgPathData.map((d: string, i: number) => (
            <path key={i} style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
          ))
        )}
      </SvgIcon>
    )
  }
)
