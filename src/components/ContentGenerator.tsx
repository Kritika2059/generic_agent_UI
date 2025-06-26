import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import PlatformSelector from './PlatformSelector';
import { 
  Loader2, 
  Sparkles, 
  Globe, 
  Upload, 
  Link, 
  FileText, 
  Settings,
  Plus,
  X,
  Key,
  Brain,
  Rocket,
  Zap
} from 'lucide-react';


const ContentGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documentMethod, setDocumentMethod] = useState('file');
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set<string>());
  const [openAIApiKey, setOpenAIApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(''); 
  const [useCustomAPI, setuseCustomAPI] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState('');

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const webhookUrl = formData.get('webhookUrl') as string;

      // Determine the apiType based on the radio button selection
      const apiType = useCustomAPI ? 'custom' : 'default';
      formData.append('apiType', apiType);

      // Determine the customApiType based on the dropdown selection
      if (useCustomAPI && selectedAPI) {
        const customApiType = selectedAPI;
        formData.append('customApiType', customApiType);
      }

      // Append OpenAI API key if it is provided
      if (openAIApiKey) {
        formData.append('openAIApiKey', openAIApiKey);
      }

      // Append Gemini API key if it is provided
      if (geminiApiKey) {
        formData.append('geminiApiKey', geminiApiKey);
      }

      // Log the webhook URL to ensure it's correct
      console.log('Webhook URL:', webhookUrl);


      formData.append('whatsapp', selectedPlatforms.has('whatsapp') ? 'true' : 'false');
      formData.append('linkedin_post', selectedPlatforms.has('linkedin_post') ? 'true' : 'false');
      formData.append('discord', selectedPlatforms.has('discord') ? 'true' : 'false');
      formData.append('slack', selectedPlatforms.has('slack') ? 'true' : 'false');
      formData.append('facebook', selectedPlatforms.has('facebook') ? 'true' : 'false');
      formData.append('instagram', selectedPlatforms.has('instagram') ? 'true' : 'false');
      formData.append('twitter', selectedPlatforms.has('twitter') ? 'true' : 'false');
      formData.append('pdf', selectedPlatforms.has('pdf') ? 'true' : 'false');

      // Append all selected files from the documents state
      const validFiles = documents.filter(doc => doc.file);
      validFiles.forEach((doc, index) => {
        // Append files if necessary
      });

      // Append document type based on whether any file was uploaded
      const documentType = validFiles.length > 0 ? 'file' : '';
      formData.append('documentType', documentType);

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Append multiple URLs
      urls.forEach(url => {
        if (url.trim() !== '') {
          formData.append('urls[]', url);
        }
      });

      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: "Content generation and publishing initiated successfully!",
        });
        (e.target as HTMLFormElement).reset();
        setSelectedPlatforms(new Set());
        setDocuments([{ id: Date.now(), file: null }]); // Reset documents to initial single input
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [urls, setUrls] = useState(['']);

  const handleAddUrl = () => {
    if (urls.length >= 13) {
      toast({
        title: "Limit Reached",
        description: "You can add a maximum of 13 URLs only.",
        variant: "destructive",
      });
      return;
    }
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const [documents, setDocuments] = useState([{ id: Date.now(), file: null }]);

  const handleAddDocument = () => {
    if (documents.length >= 13) {
      toast({
        title: "Limit Reached",
        description: "You can upload a maximum of 13 files only.",
        variant: "destructive",
      });
      return;
    }
    setDocuments([...documents, { id: Date.now(), file: null }]);
  };

  const handleRemoveDocument = (id: number) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleFileChange = (id: number, file: File) => {
    setDocuments(documents.map((doc) => (doc.id === id ? { ...doc, file } : doc)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Content Generator & Publisher
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Transform your content with AI and publish across multiple platforms seamlessly
          </p>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8">
          {/* Webhook Configuration */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-black/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Globe className="h-5 w-5 text-indigo-600" />
                </div>
                Webhook Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="webhookUrl" className="text-sm font-semibold text-slate-700">
                  n8n Webhook URL
                </Label>
                <Input
                  type="url"
                  id="webhookUrl"
                  name="webhookUrl"
                  placeholder="https://n8n.mydomain.com/webhook/my-webhook-id"
                  required
                  className="h-12 bg-white/50 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <Separator />

              {/* API Configuration */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  API Configuration
                </Label>
                
                <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-lg">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      id="defaultAPI"
                      name="APIType"
                      checked={!useCustomAPI}
                      onChange={() => setuseCustomAPI(false)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Default API</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      id="customAPI"
                      name="APIType"
                      checked={useCustomAPI}
                      onChange={() => setuseCustomAPI(true)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Custom API</span>
                  </label>
                </div>

                {useCustomAPI && (
                  <div className="space-y-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="space-y-3">
                      <Label htmlFor="apiSelection" className="text-sm font-semibold text-slate-700">
                        Select API Provider
                      </Label>
                      <select
                        id="apiSelection"
                        value={selectedAPI}
                        onChange={(e) => setSelectedAPI(e.target.value)}
                        className="h-12 w-full border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 p-3 rounded-lg bg-white transition-all"
                      >
                        <option value="">Choose an API provider</option>
                        <option value="openAI">OpenAI GPT</option>
                        <option value="gemini">Google Gemini</option>
                      </select>
                    </div>

                    {selectedAPI === 'openAI' && (
                      <div className="space-y-3">
                        <Label htmlFor="openAIApiKey" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          OpenAI API Key
                        </Label>
                        <Input
                          type="password"
                          id="openAIApiKey"
                          value={openAIApiKey}
                          onChange={(e) => setOpenAIApiKey(e.target.value)}
                          placeholder="Enter your OpenAI API key"
                          className="h-12 bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        />
                      </div>
                    )}

                    {selectedAPI === 'gemini' && (
                      <div className="space-y-3">
                        <Label htmlFor="geminiApiKey" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Gemini API Key
                        </Label>
                        <Input
                          type="password"
                          id="geminiApiKey"
                          value={geminiApiKey}
                          onChange={(e) => setGeminiApiKey(e.target.value)}
                          placeholder="Enter your Gemini API key"
                          className="h-12 bg-white border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Input Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* URLs */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-black/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Link className="h-5 w-5 text-blue-600" />
                  </div>
                  URLs
                  <Badge variant="secondary" className="ml-auto">
                    {urls.length}/13
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      type="url"
                      id={`url-${index}`}
                      name="urls"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="https://example.com"
                      className="h-11 bg-white/50 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all flex-1"
                    />
                    {urls.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveUrl(index)}
                        className="h-11 px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddUrl}
                  className="w-full h-11 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  disabled={urls.length >= 13}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add URL
                </Button>
              </CardContent>
            </Card>

           {/* Document Input Method */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-black/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Upload className="h-5 w-5 text-green-600" />
                  </div>
                  Documents
                  <Badge variant="secondary" className="ml-auto">
                    {documents.length}/13
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={doc.id} className="flex items-center gap-3">
                    <Input
                      type="file"
                      name={`document-${index}`}
                      accept=".pdf,.doc,.docx,.txt,.json,.xml,.csv"
                      onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                      className="h-11 file:mr-4 file:px-4 file:rounded-lg file:h-8 file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200 file:transition-colors"
                    />
                    {documents.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="h-11 px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddDocument}
                  className="w-full h-11 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                  disabled={documents.length >= 13}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </CardContent>
            </Card>


          </div>

          {/* Text Content */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-black/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                Text Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="text"
                name="text"
                placeholder="Enter your text content here..."
                rows={6}
                className="resize-y bg-white/50 border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </CardContent>
          </Card>

          {/* AI Prompts Section (Admin Only) */}
          {user?.role === 'admin' && (
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-0 shadow-xl ring-1 ring-amber-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-amber-800 flex items-center gap-3">
                  <div className="p-2 bg-amber-200 rounded-lg">
                    <Brain className="h-5 w-5 text-amber-700" />
                  </div>
                  AI Prompts (Admin)
                  <Badge variant="outline" className="ml-auto border-amber-300 text-amber-700">
                    Optional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="summaryPrompt" className="text-sm font-semibold text-amber-800">
                    Summary Prompt
                  </Label>
                  <Textarea
                    id="summaryPrompt"
                    name="summaryPrompt"
                    placeholder="Custom prompt for summarizing content..."
                    rows={3}
                    className="resize-y bg-white/70 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                  <p className="text-xs text-amber-600 italic">
                    Leave blank to use default summary prompt
                  </p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="postPrompt" className="text-sm font-semibold text-amber-800">
                    Post Generation Prompt
                  </Label>
                  <Textarea
                    id="postPrompt"
                    name="postPrompt"
                    placeholder="Custom prompt for converting summary to posts..."
                    rows={3}
                    className="resize-y bg-white/70 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                  <p className="text-xs text-amber-600 italic">
                    Leave blank to use default post generation prompt
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Platform Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-black/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Zap className="h-5 w-5 text-pink-600" />
                </div>
                Publishing Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PlatformSelector
                selectedPlatforms={selectedPlatforms}
                onPlatformChange={setSelectedPlatforms}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-12 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-70 min-w-[280px] h-14"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Processing Magic...
                </>
              ) : (
                <>
                  <Rocket className="mr-3 h-5 w-5" />
                  Generate & Publish Content
                </>
              )}
            </Button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;