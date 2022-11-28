import React from 'react';
import { routeList } from '../Route/routes';
import { Link } from 'react-router-dom';

const Menu: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        display: 'grid',
        gridTemplateColumns: '320px 1fr'
      }}
    >
      <nav style={{
        background: '#222222',
        margin: 0,
        padding: '64px 24px',
        overflow: 'scroll-y'
      }}>
        <ul style={{ margin: 0 }}>
        {
          routeList.map((item, i) => (
            <li style={{
              listStyle: 'none',
              fontSize: 18,
              padding: 4,
            }} key={`link-${i}`}>
              <Link style={{
                textDecoration: 'none',
                color: '#fefefe'
              }} to={item.path}>{item.title}</Link>
            </li>
          ))
        }
        </ul>
      </nav>
      <div
        onClick={onClose}
        style={{
          background: 'rgba(250, 250, 250, 0.3)',
          backdropFilter: 'blur(4px)'
        }}
      />
    </div>
  )
}

export default Menu;