import { requireAuthentication } from "../hoc/requireAuthentication";

function SecretPage() {
  return <div>My name is Nigga</div>;
}
export default SecretPage;

// export const getServerSideProps = requireAuthentication(async context => {
//   return {
//     props: {},
//   }
// })
