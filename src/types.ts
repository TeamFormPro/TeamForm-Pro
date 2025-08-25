export type Student = {
  id: string;
  name: string;
  gender?: string | null;
  skill?: number | null;
  tags?: string[] | null;
  exclude_with?: string[] | null;
};

export type Roster = { id: string; name: string };

export type Preset = {
  id: string;
  name: string;
  options_json: GroupOptions;
};

export type Lock = { studentName: string; teamIndex: number };

export type GroupOptions = {
  mode: 'teams' | 'size';
  numTeams?: number;
  teamSize?: number;
  balanceGender: boolean;
  balanceSkill: boolean;
  avoidRepeats: boolean;
  respectExclusions: boolean;
  captains?: string[];          // names; [] means auto-captains
  locks?: Lock[];               // pre-assignments by name
  customLabels?: string[];      // preset-specific team labels
  customColors?: string[];      // hex colors per team index
};
