

export default function Profile({ user }) {

  return (
    <>
      <h1>{user.firstName}'s Profile</h1>
      <h2>{user.firstName}'s Responses to Tool Requests</h2>
    </>
  );
}
