import Link from 'next/link';

const Sidebar = ({series, tales}) => {
  
  if(series.length === 0 && tales.length === 0) {
    return null;
  }

  return ( 
    <div className="scp-list-wrap">

      {/* Series */}
      <p>series</p>
      <ul className="mb-4">
        <li className="inline-block">[</li>
        {series.map((s, index) => (
          <li key={'series-'+index} className="inline-block mx-1">
            <Link href={'/series/'+s.slug}>
              <a className="inline-block p-1">{s.title}</a>
            </Link>{index !== series.length-1 ? ',' : ''}
          </li>
        ))}
        <li className="inline-block">]</li>
      </ul>

      {/* Tales */}
      <p>tales</p>
      <ul className="mb-4">
        <li className="inline-block">[</li>
        {tales.map((s, index) => (
          <li key={'series-'+index} className="inline-block mx-1">
            <Link href={'/series/'+s.slug}>
              <a className="inline-block p-1">{s.title}</a>
            </Link>{index !== tales.length-1 ? ',' : ''}
          </li>
        ))}
        <li className="inline-block">]</li>
      </ul>

    </div> 
  );
}

export default Sidebar;