import React, { forwardRef } from 'react';

import { DetectedObject } from '../../packages/tensorflow';

interface Props {
  objects: DetectedObject[];
  opacity?: number;
  showCenter?: boolean;
}

const TargetView = forwardRef<HTMLDivElement,Props>(({ objects, opacity = 0.5, showCenter = false }, ref) => {

  return (
    <div ref={ref} style={{
      position: 'relative'
    }}>
      {
        objects.map((obj,i) => {
          return (
            <>
              <p
                style={{
                position: 'absolute',
                marginInlineStart: obj.left,
                marginBlockStart: obj.top - 20,
                width: obj.width,
                top: 0,
                left: 0,
                background: '#cc0000',
                opacity
              }}>{ `${obj.class} - with ${Math.round(parseFloat(obj.score.toString()) * 100)} % confidence.` }</p>
              <div
                style={{
                position: 'absolute',
                left: obj.left,
                top: obj.top,
                width: obj.width,
                height: obj.height,
                background: '#00cc00',
                opacity
              }}></div>
              {
                showCenter && (
                  <div
                    style={{
                      position: 'absolute',
                      left: obj.center.x,
                      top: obj.center.y,
                      width: 10,
                      height: 10,
                      background: '#000',
                      transform: 'translate(-50%,-50%,)',
                      opacity
                    }}
                  ></div>
                )
              }
            </>
          )
        })
      }
    </div>
  )
});

export default TargetView;