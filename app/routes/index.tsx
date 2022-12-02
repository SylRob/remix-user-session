import { json, LoaderFunction, Session } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { commitSession, getUserSession } from '~/utils/session';

export const loader: LoaderFunction = async ({ request }) => {
  return await getUserSession(request, async (token: string, session: Session) => {
    console.log('in loader', token);
    
    if (token) return json({ hello: 'world', token }, {
      headers: {
        'Set-Cookie': await commitSession(session)
      }
    });
    return json({ hello: 'world', token });
  });
}

export default function Index() {
  const { hello } = useLoaderData();
  return (
    <div>
      <p>hello</p>
      <p>{hello}</p>
    </div>
  );
}
