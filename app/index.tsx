import { Redirect } from 'expo-router';

export default function Index() {
  // This will be the entry point - redirects to welcome
  return <Redirect href="/welcome" />;
}
