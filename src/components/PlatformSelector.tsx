import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Briefcase, Users, Monitor, User, Camera, Bird, PaperclipIcon } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: Set<string>;
  onPlatformChange: (platforms: Set<string>) => void;
}

const platforms = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageSquare,
    color: 'bg-green-500 hover:bg-green-600',
    activeColor: 'bg-green-600 text-white',
  },
  {
    id: 'linkedin_post',
    name: 'LinkedIn Post',
    icon: Briefcase,
    color: 'bg-blue-600 hover:bg-blue-700',
    activeColor: 'bg-blue-700 text-white',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: Users,
    color: 'bg-indigo-600 hover:bg-indigo-700',
    activeColor: 'bg-indigo-700 text-white',
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: Monitor,
    color: 'bg-purple-600 hover:bg-purple-700',
    activeColor: 'bg-purple-700 text-white',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: User,
    color: 'bg-blue-500 hover:bg-blue-600',
    activeColor: 'bg-blue-600 text-white',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Camera,
    color: 'bg-pink-500 hover:bg-pink-600',
    activeColor: 'bg-pink-600 text-white',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Bird,
    color: 'bg-sky-500 hover:bg-sky-600',
    activeColor: 'bg-sky-600 text-white',
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: PaperclipIcon,
    color: 'bg-sky-500 hover:bg-sky-600',
    activeColor: 'bg-sky-600 text-white',
  },
];

const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatforms,
  onPlatformChange,
}) => {
  const togglePlatform = (platformId: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    onPlatformChange(newSelected);
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-lg text-purple-700 text-center">
          Publishing Platforms
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Select platforms where you want to publish your content
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            const isActive = selectedPlatforms.has(platform.id);
            
            return (
              <Button
                key={platform.id}
                type="button"
                variant={isActive ? "default" : "outline"}
                className={`
                  h-16 w-24 flex-col gap-1 transition-all duration-200 hover:scale-105 active:scale-95
                  ${isActive 
                    ? platform.activeColor 
                    : 'bg-white hover:bg-gray-50 border-2 hover:border-gray-300'
                  }
                `}
                onClick={() => togglePlatform(platform.id)}
              >
                <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>
                  {platform.name}
                </span>
              </Button>
            );
          })}
        </div>
        {selectedPlatforms.size > 0 && (
          <div className="mt-4 p-3 bg-white/60 rounded-lg">
            <p className="text-sm text-purple-700 font-medium">
              Selected: {Array.from(selectedPlatforms).map(id => 
                platforms.find(p => p.id === id)?.name
              ).join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformSelector;
