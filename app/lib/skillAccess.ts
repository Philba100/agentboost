import skills from './skillsData';

export function getFreeSkills() {
  return skills.filter(s => s.free === true);
}

export function getPaidSkills() {
  return skills.filter(s => s.free !== true);
}

export function canAccessSkill(skillId: string, userTier: string, purchasedSkills: string[] = []): boolean {
  const skill = skills.find(s => s.id === skillId);
  
  if (!skill) return false;
  
  // Free skills always accessible
  if (skill.free) return true;
  
  // Enterprise has access to everything
  if (userTier === 'enterprise') return true;
  
  // Pro users can access purchased skills
  if (userTier === 'pro' && purchasedSkills.includes(skillId)) return true;
  
  return false;
}

export function getAccessStatus(skillId: string, userTier: string, purchasedSkills: string[] = []): {
  canAccess: boolean;
  reason: string;
  tier: 'free' | 'paid' | 'locked';
} {
  const skill = skills.find(s => s.id === skillId);
  
  if (!skill) {
    return { canAccess: false, reason: 'Skill not found', tier: 'locked' };
  }
  
  if (skill.free) {
    return { canAccess: true, reason: 'Free skill', tier: 'free' };
  }
  
  if (userTier === 'enterprise') {
    return { canAccess: true, reason: 'Enterprise access', tier: 'paid' };
  }
  
  if (userTier === 'pro' && purchasedSkills.includes(skillId)) {
    return { canAccess: true, reason: 'Purchased skill', tier: 'paid' };
  }
  
  return { 
    canAccess: false, 
    reason: 'Upgrade required - this skill requires Pro tier',
    tier: 'locked'
  };
}
