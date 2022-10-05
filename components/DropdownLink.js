import Link from 'next/link';

const DropdownLink = (props) => {
  const { href, children, ...rest } = props;

  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  );
};

export default DropdownLink;
