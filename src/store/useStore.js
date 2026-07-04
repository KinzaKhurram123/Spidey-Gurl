import { create } from "zustand";
import { persist } from "zustand/middleware";
import { publishSurprise } from "../lib/firebase";

const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const defaultState = {
  auth: {
    passphrase: "spidey123",
    isAuthenticated: false,
  },
  settings: {
    themeAccent: "crimson-gold",
  },
  projects: [
    {
      id: uid(),
      name: "His Birthday Surprise",
      type: "birthday",
      status: "in-progress",
      priority: "high",
      launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5)
        .toISOString()
        .slice(0, 10),
      createdAt: new Date().toISOString(),
    },
  ],
  birthday: {
    gateway: { passphrase: "openmyheart" },
    entrance: {
      theme: "Midnight Rose Garden",
      wishText: "Happy Birthday to the boy who lights up my universe.",
      floatingHearts: true,
      floatingPetals: true,
    },
    characterStage: { glbUrl: "" },
    repositories: {
      memoryVault: [],
      messageJar: [],
      secretLetters: [],
    },
  },
  sorry: {
    apologyText: "I'm sorry for making you upset. You mean everything to me.",
    flowersCount: 12,
    forgivenessSlider: 50,
  },
  anniversary: {
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365)
      .toISOString()
      .slice(0, 10),
    wishesText:
      "Every day with you feels like the first day. Happy anniversary, my love.",
  },
  proposal: {
    question: "Will you marry me?",
    yesResponseText: "You just made me the happiest person alive!",
    noButtonBehavior: "shrink",
  },
  occasions: [],
  checklist: [
    {
      id: uid(),
      text: "Book the rooftop venue",
      priority: "high",
      done: false,
    },
    { id: uid(), text: "Order the flowers", priority: "medium", done: false },
    { id: uid(), text: "Pick the playlist", priority: "low", done: true },
  ],
};

const syncSurprise = (key, get) => {
  publishSurprise(key, get()[key]).catch(() => {});
};
const syncBirthday = (get) => syncSurprise("birthday", get);

export const useStore = create(
  persist(
    (set, get) => ({
      ...defaultState,

      login: (passphrase) => {
        if (passphrase === get().auth.passphrase) {
          set((s) => ({ auth: { ...s.auth, isAuthenticated: true } }));
          return true;
        }
        return false;
      },
      logout: () =>
        set((s) => ({ auth: { ...s.auth, isAuthenticated: false } })),
      changePassphrase: (next) =>
        set((s) => ({ auth: { ...s.auth, passphrase: next } })),
      setThemeAccent: (accent) =>
        set((s) => ({ settings: { ...s.settings, themeAccent: accent } })),

      addProject: (project) =>
        set((s) => ({
          projects: [
            {
              id: uid(),
              status: "planning",
              priority: "medium",
              createdAt: new Date().toISOString(),
              ...project,
            },
            ...s.projects,
          ],
        })),
      updateProject: (id, patch) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, ...patch } : p,
          ),
        })),
      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      updateBirthdayGateway: (patch) => {
        set((s) => ({
          birthday: {
            ...s.birthday,
            gateway: { ...s.birthday.gateway, ...patch },
          },
        }));
        syncBirthday(get);
      },
      updateBirthdayEntrance: (patch) => {
        set((s) => ({
          birthday: {
            ...s.birthday,
            entrance: { ...s.birthday.entrance, ...patch },
          },
        }));
        syncBirthday(get);
      },
      updateCharacterStage: (patch) => {
        set((s) => ({
          birthday: {
            ...s.birthday,
            characterStage: { ...s.birthday.characterStage, ...patch },
          },
        }));
        syncBirthday(get);
      },

      addRepoItem: (repo, item) => {
        set((s) => ({
          birthday: {
            ...s.birthday,
            repositories: {
              ...s.birthday.repositories,
              [repo]: [
                { id: uid(), createdAt: new Date().toISOString(), ...item },
                ...s.birthday.repositories[repo],
              ],
            },
          },
        }));
        syncBirthday(get);
      },
      updateRepoItem: (repo, id, patch) => {
        set((s) => ({
          birthday: {
            ...s.birthday,
            repositories: {
              ...s.birthday.repositories,
              [repo]: s.birthday.repositories[repo].map((it) =>
                it.id === id ? { ...it, ...patch } : it,
              ),
            },
          },
        }));
        syncBirthday(get);
      },
      deleteRepoItem: (repo, id) => {
        set((s) => ({
          birthday: {
            ...s.birthday,
            repositories: {
              ...s.birthday.repositories,
              [repo]: s.birthday.repositories[repo].filter(
                (it) => it.id !== id,
              ),
            },
          },
        }));
        syncBirthday(get);
      },

      updateSorry: (patch) => {
        set((s) => ({ sorry: { ...s.sorry, ...patch } }));
        syncSurprise("sorry", get);
      },
      updateAnniversary: (patch) => {
        set((s) => ({ anniversary: { ...s.anniversary, ...patch } }));
        syncSurprise("anniversary", get);
      },
      updateProposal: (patch) => {
        set((s) => ({ proposal: { ...s.proposal, ...patch } }));
        syncSurprise("proposal", get);
      },

      addOccasion: (occasion) =>
        set((s) => ({
          occasions: [
            {
              id: uid(),
              accentColor: "#ff3d68",
              content: "",
              createdAt: new Date().toISOString(),
              ...occasion,
            },
            ...s.occasions,
          ],
        })),
      updateOccasion: (id, patch) =>
        set((s) => ({
          occasions: s.occasions.map((o) =>
            o.id === id ? { ...o, ...patch } : o,
          ),
        })),
      deleteOccasion: (id) =>
        set((s) => ({ occasions: s.occasions.filter((o) => o.id !== id) })),

      addChecklistItem: (item) =>
        set((s) => ({
          checklist: [
            { id: uid(), done: false, priority: "medium", ...item },
            ...s.checklist,
          ],
        })),
      toggleChecklistItem: (id) =>
        set((s) => ({
          checklist: s.checklist.map((c) =>
            c.id === id ? { ...c, done: !c.done } : c,
          ),
        })),
      deleteChecklistItem: (id) =>
        set((s) => ({ checklist: s.checklist.filter((c) => c.id !== id) })),

      exportBackup: () => {
        const state = get();
        const { auth, ...rest } = state;
        return JSON.stringify({ ...rest, auth: { ...auth } }, null, 2);
      },
      importBackup: (json) => {
        try {
          const data = JSON.parse(json);
          set(() => ({ ...defaultState, ...data }));
          return true;
        } catch {
          return false;
        }
      },
      factoryReset: () =>
        set(() => ({
          ...defaultState,
          auth: { ...defaultState.auth, isAuthenticated: true },
        })),
    }),
    {
      name: "spidey-gurl-zone-storage",
    },
  ),
);
