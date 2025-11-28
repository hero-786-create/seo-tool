
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { KeywordData, DomainMetrics, ContentAuditResult, BacklinkData, SiteAuditData, RankData, MarketInsightResult, LocalSeoResult, SocialContentResult, MetaTagResult, KeywordGapResult, BrokenLinkResult, PPCDataResult, SerpAnalysisResult, DomainComparisonResult, SerpVolatility, GoogleEssentialResult, KeywordVisualResult, SemanticKeyword, TrendData, GmbLocation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";
const liteModelName = "gemini-2.5-flash-lite";
const proModelName = "gemini-3-pro-preview";
const ttsModelName = "gemini-2.5-flash-preview-tts";

export const GeminiService = {
  async generateKeywords(seed: string): Promise<KeywordData[]> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Act as a Senior SEO Strategist. Generate 20 high-potential keywords for: "${seed}".
        Prioritize finding "hidden gems" (good volume, low difficulty).
        
        For each keyword, simulate a SERP analysis to calculate:
        - **Difficulty (0-100)**: Based on domain authority of top 10 results, backlink profiles, and content quality.
        - **Intent**: Informational, Commercial, etc.
        - **Topic Cluster**: Group into a parent topic.
        
        Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                volume: { type: Type.INTEGER },
                difficulty: { type: Type.INTEGER },
                cpc: { type: Type.NUMBER },
                intent: { type: Type.STRING, enum: ['Informational', 'Commercial', 'Transactional', 'Navigational'] },
                topic: { type: Type.STRING },
                isLongTail: { type: Type.BOOLEAN },
                trend: { type: Type.ARRAY, items: { type: Type.INTEGER } }
              },
              required: ["keyword", "volume", "difficulty", "cpc", "intent", "trend", "topic", "isLongTail"]
            }
          }
        }
      });
      
      const json = JSON.parse(response.text || "[]");
      return json as KeywordData[];
    } catch (error) {
      console.error("Gemini Keyword Error:", error);
      return [];
    }
  },

  async analyzeDomain(domain: string): Promise<DomainMetrics | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze domain: "${domain}". 
        Provide realistic SEO metrics (Authority 0-100, Traffic, Backlinks).
        Identify 3 organic competitors.
        Generate simulated SERP snapshots for top 3 keywords.
        Provide 6-month and 8-week traffic trends.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              authorityScore: { type: Type.INTEGER },
              organicTraffic: { type: Type.INTEGER },
              backlinks: { type: Type.INTEGER },
              topKeywords: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { keyword: { type: Type.STRING }, position: { type: Type.INTEGER } }
                }
              },
              competitors: {
                type: Type.ARRAY,
                items: { 
                    type: Type.OBJECT,
                    properties: { domain: { type: Type.STRING }, authorityScore: { type: Type.INTEGER }, organicTraffic: { type: Type.INTEGER } }
                }
              },
              trafficTrend: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { month: { type: Type.STRING }, value: { type: Type.INTEGER } } }
              },
              weeklyTrend: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, value: { type: Type.INTEGER } } }
              },
              serpSnapshots: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { keyword: { type: Type.STRING }, title: { type: Type.STRING }, url: { type: Type.STRING }, snippet: { type: Type.STRING }, position: { type: Type.INTEGER } }
                }
              }
            }
          }
        }
      });

      const json = JSON.parse(response.text || "{}");
      return json as DomainMetrics;
    } catch (error) {
      console.error("Gemini Domain Error:", error);
      return null;
    }
  },

  async auditContent(text: string): Promise<ContentAuditResult | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Audit this SEO content. Rate 0-100. Check freshness, readability, tone. Suggestions. Text: "${text.substring(0, 5000)}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              freshnessScore: { type: Type.INTEGER },
              readability: { type: Type.STRING },
              tone: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              keywordsDetected: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      });

      const json = JSON.parse(response.text || "{}");
      return json as ContentAuditResult;
    } catch (error) {
      console.error("Gemini Audit Error:", error);
      return null;
    }
  },

  async getBacklinkAnalysis(domain: string): Promise<BacklinkData | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze backlinks for "${domain}". Estimate Spam Score, DA, and counts.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
             type: Type.OBJECT,
             properties: {
                spamScore: { type: Type.INTEGER },
                totalBacklinks: { type: Type.INTEGER },
                referringDomains: { type: Type.INTEGER },
                domainAuthority: { type: Type.INTEGER },
                topAnchors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { anchor: { type: Type.STRING }, percent: { type: Type.NUMBER } } } },
                newLost: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, new: { type: Type.INTEGER }, lost: { type: Type.INTEGER } } } },
                backlinkTypes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: { type: Type.STRING }, count: { type: Type.INTEGER } } } }
             }
          }
        }
      });
      return JSON.parse(response.text || "{}") as BacklinkData;
    } catch (error) {
      return null;
    }
  },

  async runSiteAudit(url: string): Promise<SiteAuditData | null> {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Deep Technical SEO audit for "${url}". 
            Simulate a crawler like Ahrefs/Semrush.
            Provide DR (Domain Rating), UR (URL Rating), Backlinks, Traffic.
            Analyze Indexability (Robots, Sitemap, Canonical).
            Analyze Social Tags (OG, Twitter).
            Analyze HTTP Headers (Status, Security).
            Analyze Images (Alt text, sizes).
            Analyze Outgoing Links.
            Focus on Core Web Vitals and technical errors.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        healthScore: { type: Type.INTEGER },
                        dr: { type: Type.INTEGER },
                        ur: { type: Type.INTEGER },
                        backlinks: { type: Type.INTEGER },
                        refDomains: { type: Type.INTEGER },
                        organicKeywords: { type: Type.INTEGER },
                        organicTraffic: { type: Type.INTEGER },
                        crawledPages: { type: Type.INTEGER },
                        errors: { type: Type.INTEGER },
                        warnings: { type: Type.INTEGER },
                        notices: { type: Type.INTEGER },
                        indexability: {
                            type: Type.OBJECT,
                            properties: {
                                canonical: { type: Type.STRING },
                                robotsTxt: { type: Type.STRING },
                                sitemap: { type: Type.STRING },
                                metaRobots: { type: Type.STRING },
                                hreflang: { type: Type.STRING }
                            }
                        },
                        socialTags: {
                            type: Type.OBJECT,
                            properties: {
                                ogTitle: { type: Type.STRING },
                                ogImage: { type: Type.STRING },
                                twitterCard: { type: Type.STRING },
                                schemaTypes: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        httpHeaders: {
                            type: Type.OBJECT,
                            properties: {
                                statusCode: { type: Type.INTEGER },
                                contentType: { type: Type.STRING },
                                server: { type: Type.STRING },
                                xFrameOptions: { type: Type.STRING }
                            }
                        },
                        images: {
                            type: Type.OBJECT,
                            properties: {
                                total: { type: Type.INTEGER },
                                missingAlt: { type: Type.INTEGER },
                                largeFiles: { type: Type.INTEGER }
                            }
                        },
                        outgoingLinks: {
                            type: Type.OBJECT,
                            properties: {
                                internal: { type: Type.INTEGER },
                                external: { type: Type.INTEGER },
                                broken: { type: Type.INTEGER }
                            }
                        },
                        coreWebVitals: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { metric: { type: Type.STRING }, value: { type: Type.STRING }, status: { type: Type.STRING, enum: ['Good', 'Poor', 'Needs Improvement'] } }
                            }
                        },
                        topIssues: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { issue: { type: Type.STRING }, priority: { type: Type.STRING }, count: { type: Type.INTEGER }, fixSuggestion: { type: Type.STRING } }
                            }
                        }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}") as SiteAuditData;
    } catch (e) {
        return null;
    }
  },

  async checkRankings(domain: string): Promise<RankData | null> {
      try {
          const response = await ai.models.generateContent({
              model: modelName,
              contents: `Track rankings for "${domain}". Estimate visibility and position changes.`,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          visibility: { type: Type.NUMBER },
                          avgPosition: { type: Type.NUMBER },
                          keywords: {
                              type: Type.ARRAY,
                              items: {
                                  type: Type.OBJECT,
                                  properties: { keyword: { type: Type.STRING }, position: { type: Type.INTEGER }, previousPosition: { type: Type.INTEGER }, volume: { type: Type.INTEGER }, serpFeatures: { type: Type.ARRAY, items: { type: Type.STRING } } }
                              }
                          }
                      }
                  }
              }
          });
          return JSON.parse(response.text || "{}") as RankData;
      } catch (e) {
          return null;
      }
  },

  async getMarketInsights(query: string): Promise<MarketInsightResult> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `SEO market insights for: "${query}".`,
        config: { tools: [{ googleSearch: {} }] }
      });
      
      const text = response.text || "";
      const sources: any[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk: any) => {
         if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      });
      return { text, sources };
    } catch (error) {
      return { text: "Failed to retrieve market insights.", sources: [] };
    }
  },

  async getLocalSeo(query: string): Promise<LocalSeoResult> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Find local businesses: "${query}".`,
        config: { tools: [{ googleMaps: {} }] }
      });
      return { text: response.text || "", places: [] };
    } catch (error) {
      return { text: "Failed to retrieve local SEO data.", places: [] };
    }
  },

  async chatWithGemini(message: string, history: {role: string, parts: {text: string}[]}[], useThinking = false): Promise<string> {
    try {
      const chatConfig: any = { systemInstruction: "You are Genie Metrics AI, an expert SEO consultant." };
      if (useThinking) chatConfig.thinkingConfig = { thinkingBudget: 32768 };
      
      const chat = ai.chats.create({
        model: proModelName,
        history: history,
        config: chatConfig
      });
      const result = await chat.sendMessage({ message });
      return result.text || "";
    } catch (error) {
      return "I'm having trouble connecting right now.";
    }
  },

  async rewriteContent(text: string, instruction: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Rewrite: "${instruction}". Text: "${text.substring(0, 5000)}"`,
      });
      return response.text || text;
    } catch (error) { return text; }
  },

  async generateSchemaMarkup(type: string, input: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate JSON-LD schema for "${type}". Input: "${input}". Return ONLY JSON.`,
            config: { responseMimeType: "application/json" }
        });
        return response.text || "{}";
    } catch (error) { return "{}"; }
  },

  async generateSocialContent(platform: 'Hashtags' | 'YouTube' | 'TikTok' | 'Captions' | 'Scripts', topic: string): Promise<SocialContentResult> {
    try {
      const response = await ai.models.generateContent({
        model: liteModelName,
        contents: `Generate ${platform} content for "${topic}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { content: { type: Type.ARRAY, items: { type: Type.STRING } } }
          }
        }
      });
      const json = JSON.parse(response.text || "{}");
      return { type: platform.toLowerCase() as any, content: json.content || [] };
    } catch (error) { return { type: 'hashtags', content: [] }; }
  },

  async generateMetaTags(topic: string, keywords: string): Promise<MetaTagResult | null> {
    try {
      const response = await ai.models.generateContent({
        model: liteModelName,
        contents: `Generate SEO Title and Meta Description for "${topic}". Keywords: "${keywords}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, previewUrl: { type: Type.STRING } }
          }
        }
      });
      return JSON.parse(response.text || "{}") as MetaTagResult;
    } catch (e) { return null; }
  },

  async generateSocialPostFromContent(platform: 'Twitter' | 'LinkedIn' | 'Facebook', content: string, topic?: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: liteModelName,
        contents: `Write a ${platform} post. ${topic ? `Focus: ${topic}` : ''}. Content: "${content.substring(0, 5000)}"`
      });
      return response.text || "";
    } catch (error) { return "Failed to generate post."; }
  },

  async generateBlogPost(topic: string, keywords: string, type: 'Outline' | 'Full Post'): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: proModelName,
        contents: `Generate a ${type} for topic: "${topic}". Keywords: "${keywords}". Format Markdown.`,
      });
      return response.text || "Failed to generate content.";
    } catch (e) { return "Error generating content."; }
  },

  async getKeywordGap(myDomain: string, competitorDomain: string): Promise<KeywordGapResult | null> {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Keyword Gap Analysis between "${myDomain}" and "${competitorDomain}".
            Identify Missing, Shared, and Weak keywords.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        missing: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: {type: Type.STRING}, volume: {type: Type.INTEGER}, kd: {type: Type.INTEGER}, competitorPos: {type: Type.INTEGER} } } },
                        shared: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: {type: Type.STRING}, volume: {type: Type.INTEGER}, myPos: {type: Type.INTEGER}, competitorPos: {type: Type.INTEGER} } } },
                        weak: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: {type: Type.STRING}, volume: {type: Type.INTEGER}, myPos: {type: Type.INTEGER}, competitorPos: {type: Type.INTEGER} } } }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}") as KeywordGapResult;
    } catch (e) { return null; }
  },

  async checkBrokenLinks(url: string): Promise<BrokenLinkResult | null> {
      try {
          const response = await ai.models.generateContent({
              model: modelName,
              contents: `Simulate broken link check for "${url}". Return 3-5 simulated 404s.`,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          totalLinks: { type: Type.INTEGER },
                          brokenCount: { type: Type.INTEGER },
                          links: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { url: { type: Type.STRING }, statusCode: { type: Type.INTEGER }, sourcePage: { type: Type.STRING }, anchorText: { type: Type.STRING } } } }
                      }
                  }
              }
          });
          return JSON.parse(response.text || "{}") as BrokenLinkResult;
      } catch (e) { return null; }
  },

  async getPPCData(domain: string): Promise<PPCDataResult | null> {
      try {
          const response = await ai.models.generateContent({
              model: modelName,
              contents: `Analyze PPC for "${domain}". Budget, Keywords, Sample Ads.`,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                          estimatedBudget: { type: Type.NUMBER },
                          paidKeywords: { type: Type.INTEGER },
                          topAdKeywords: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keyword: {type: Type.STRING}, cpc: {type: Type.NUMBER}, volume: {type: Type.INTEGER}, competition: {type: Type.NUMBER} } } },
                          sampleAds: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { headline: {type: Type.STRING}, description: {type: Type.STRING}, url: {type: Type.STRING} } } }
                      }
                  }
              }
          });
          return JSON.parse(response.text || "{}") as PPCDataResult;
      } catch (e) { return null; }
  },

  async getSerpAnalysis(keyword: string): Promise<SerpAnalysisResult | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Analyze Google SERP for "${keyword}". Top 10 results with DA, Backlinks, Word Count.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              difficulty: { type: Type.INTEGER },
              volume: { type: Type.INTEGER },
              results: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: { rank: { type: Type.INTEGER }, title: { type: Type.STRING }, url: { type: Type.STRING }, domainAuthority: { type: Type.INTEGER }, backlinks: { type: Type.INTEGER }, wordCount: { type: Type.INTEGER } }
                }
              }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}") as SerpAnalysisResult;
    } catch (error) { return null; }
  },

  async compareDomains(domains: string[]): Promise<DomainComparisonResult | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Compare domains: ${domains.join(', ')}. Stats and Winner.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              domains: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { domain: { type: Type.STRING }, authorityScore: { type: Type.INTEGER }, organicTraffic: { type: Type.INTEGER }, paidTraffic: { type: Type.INTEGER }, keywords: { type: Type.INTEGER }, backlinks: { type: Type.INTEGER } } } },
              winner: { type: Type.STRING },
              insight: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}") as DomainComparisonResult;
    } catch (error) { return null; }
  },

  async getSerpVolatility(): Promise<SerpVolatility | null> {
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: `Generate current Google SERP Volatility score (0-10) and status for today.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        status: { type: Type.STRING, enum: ['Quiet', 'Normal', 'High', 'Very High'] },
                        date: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}") as SerpVolatility;
    } catch(e) { return null; }
  },

  async generateSpeech(text: string, voiceName: string = 'Kore'): Promise<string | null> {
      try {
          const response = await ai.models.generateContent({
              model: ttsModelName,
              contents: { parts: [{ text }] },
              config: {
                  responseModalities: [Modality.AUDIO],
                  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
              }
          });
          const part = response.candidates?.[0]?.content?.parts?.[0];
          if (part && part.inlineData) return part.inlineData.data;
          return null;
      } catch (e) { return null; }
  },

  async generateImage(prompt: string, aspectRatio: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any
          }
        }
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) { return null; }
  },

  async analyzeImage(base64Data: string, prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: proModelName,
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: prompt }
          ]
        }
      });
      return response.text || "";
    } catch (error) { return "Analysis failed."; }
  },

  async transcribeAudio(base64Data: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [
            { inlineData: { mimeType: 'audio/mp3', data: base64Data } },
            { text: "Transcribe this audio." }
          ]
        }
      });
      return response.text || "";
    } catch (error) { return "Transcription failed."; }
  },

  async analyzeVideo(base64Data: string, prompt: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: proModelName,
        contents: {
          parts: [
            { inlineData: { mimeType: 'video/mp4', data: base64Data } },
            { text: prompt }
          ]
        }
      });
      return response.text || "";
    } catch (error) { return "Analysis failed."; }
  },

  async runGoogleEssentials(url: string): Promise<GoogleEssentialResult | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Simulate Google Mobile-Friendly and PageSpeed insights for "${url}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mobileFriendly: { type: Type.BOOLEAN },
              performanceScore: { type: Type.INTEGER },
              lcp: { type: Type.STRING },
              fid: { type: Type.STRING },
              cls: { type: Type.STRING },
              screenshot: { type: Type.STRING }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}") as GoogleEssentialResult;
    } catch (e) { return null; }
  },

  async runClusterKeywords(keywords: string): Promise<{ cluster: string; keywords: string[] }[]> {
     try {
       const response = await ai.models.generateContent({
         model: modelName,
         contents: `Cluster these keywords into topic groups: ${keywords}`,
         config: {
           responseMimeType: "application/json",
           responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 cluster: { type: Type.STRING },
                 keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
               }
             }
           }
         }
       });
       return JSON.parse(response.text || "[]");
     } catch (e) { return []; }
  },

  async generateRobotsTxt(domain: string, type: string): Promise<string> {
     try {
       const response = await ai.models.generateContent({
         model: liteModelName,
         contents: `Generate a valid robots.txt file for "${domain}". Type: "${type}".`,
       });
       return response.text || "";
     } catch (e) { return ""; }
  },

  async generateHreflang(url: string, languages: string): Promise<string> {
     try {
       const response = await ai.models.generateContent({
         model: liteModelName,
         contents: `Generate hreflang HTML tags for "${url}". Languages: "${languages}".`,
       });
       return response.text || "";
     } catch (e) { return ""; }
  },

  // --- NEW FEATURES ---

  async generateKeywordVisuals(keyword: string): Promise<KeywordVisualResult | null> {
     try {
       const response = await ai.models.generateContent({
         model: modelName,
         contents: `Generate 'AnswerThePublic' style data for "${keyword}".
         Lists of Questions (Who, What, Where...), Prepositions (With, For, To...), Comparisons (Vs, Or, Like...), and Related.`,
         config: {
           responseMimeType: "application/json",
           responseSchema: {
             type: Type.OBJECT,
             properties: {
               questions: { type: Type.ARRAY, items: { type: Type.STRING } },
               prepositions: { type: Type.ARRAY, items: { type: Type.STRING } },
               comparisons: { type: Type.ARRAY, items: { type: Type.STRING } },
               related: { type: Type.ARRAY, items: { type: Type.STRING } }
             }
           }
         }
       });
       return JSON.parse(response.text || "{}");
     } catch(e) { return null; }
  },

  async getSemanticAnalysis(topic: string, content: string): Promise<SemanticKeyword[]> {
     try {
       const response = await ai.models.generateContent({
         model: modelName,
         contents: `Act as SurferSEO / Clearscope. Analyze this content against topic "${topic}".
         Return a list of NLP/LSI keywords that should be included, their importance, recommended count, and current count in text.`,
         config: {
           responseMimeType: "application/json",
           responseSchema: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 keyword: { type: Type.STRING },
                 importance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                 recommendedCount: { type: Type.INTEGER },
                 currentCount: { type: Type.INTEGER }
               }
             }
           }
         }
       });
       return JSON.parse(response.text || "[]");
     } catch(e) { return []; }
  },

  async getTrendData(query: string): Promise<TrendData | null> {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `Simulate Google Trends data for "${query}". Return interest over time (12 months), related topics, and regional interest.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              query: { type: Type.STRING },
              interestOverTime: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, value: { type: Type.INTEGER } } } },
              relatedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
              regionalInterest: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { region: { type: Type.STRING }, value: { type: Type.INTEGER } } } }
            }
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch(e) { return null; }
  },

  async simulateGmbInsights(businessName: string): Promise<GmbLocation | null> {
    try {
       const response = await ai.models.generateContent({
         model: modelName,
         contents: `Simulate Google Business Profile insights for "${businessName}".`,
         config: {
           responseMimeType: "application/json",
           responseSchema: {
             type: Type.OBJECT,
             properties: {
               name: { type: Type.STRING },
               address: { type: Type.STRING },
               rating: { type: Type.NUMBER },
               reviews: { type: Type.INTEGER },
               views: { type: Type.INTEGER },
               calls: { type: Type.INTEGER }
             }
           }
         }
       });
       return JSON.parse(response.text || "{}");
    } catch(e) { return null; }
  }
};
