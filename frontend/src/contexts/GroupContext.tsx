import {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { AuthContext } from "./AuthContext";
import { authedFetch } from "../utility/AuthedFetch";

export interface Group {
  gid: string; // group owner
  members: string[]; // group members
  name: string; // group name
  description: string; // group description
  events: string[]; // group events
}

const initialGroupState: Group = {
  gid: "",
  members: [],
  name: "",
  description: "",
  events: [],
};

interface GroupContextState {
  group: Group;
  updateGroup: (newGroupDetails: Partial<Group>) => Promise<void>;
  groups: Group[];
  setGroups: (groups: Group[]) => void;
  isLoading: boolean;
}

export const GroupContext = createContext<GroupContextState>({
  group: initialGroupState,
  updateGroup: async () => {},
  groups: [],
  setGroups: () => {},
  isLoading: true,
});

interface GroupContextProps {
  children: ReactNode;
}

export const GroupContextProvider = ({ children }: GroupContextProps) => {
  const { user } = useContext(AuthContext);
  const [group, setGroup] = useState<Group>(initialGroupState);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuthenticated = user != null;

  const updateGroup = useCallback(
    async (newGroupDetails: Partial<Group>) => {
      if (isAuthenticated) {
        setGroup((prevState) => ({ ...prevState, ...newGroupDetails }));

        // Save what will be the new group to local storage
        localStorage.setItem(
          "group",
          JSON.stringify({ ...group, ...newGroupDetails })
        );
      } else {
        console.error("Cannot update group when not authenticated");
      }
    },
    [group, isAuthenticated]
  );

  // this runs once when the component is mounted
  useEffect(() => {
    async function fetchUserGroups() {
      setIsLoading(true);
      if (isAuthenticated) {
        try {
          const response = await authedFetch("/api/groups/user");
          if (!response.ok) {
            throw new Error("Failed to fetch user groups");
          }
          const userGroups: Group[] = await response.json();
          setGroups(userGroups);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    const groupFromLocalStorage = localStorage.getItem("group");

    if (groupFromLocalStorage) {
      setGroup(JSON.parse(groupFromLocalStorage));
    }
    fetchUserGroups();
  }, [isAuthenticated, group.gid]);

  const value = isAuthenticated
    ? { group, updateGroup, groups, setGroups, isLoading }
    : {
        group: initialGroupState,
        updateGroup: async () => {},
        groups: [],
        setGroups: () => {},
        isLoading: true,
      };

  return (
    <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
  );
};

export const useGroupState = () => useContext(GroupContext);
