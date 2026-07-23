from typing import Dict, Any, List
from datetime import date
import random

class MockTravelPlannerService:
    """
    Mock AI Travel planner service.
    Generates a structured, beautiful, realistic travel itinerary based on user input.
    Operates without API keys or network latency, serving as a development utility.
    """
    
    @staticmethod
    def generate_itinerary(
        destination: str,
        start_date: date,
        end_date: date,
        budget_level: str,
        traveler_type: str,
        interests: List[str]
    ) -> Dict[str, Any]:
        
        # Calculate duration in days
        delta = end_date - start_date
        days = max(1, delta.days + 1)
        
        # Base templates for itinerary items based on interests
        activity_pool = {
            "Food": [
                {"name": "Local Street Food Tour", "desc": "Savor authentic regional dishes led by a local guide.", "cost_pct": 0.15, "cat": "Food"},
                {"name": "Traditional Cooking Masterclass", "desc": "Learn secrets to preparing local delicacies from scratch.", "cost_pct": 0.25, "cat": "Food"},
                {"name": "Michelin-starred Dinner Experience", "desc": "Indulge in a premium gastronomic multi-course tasting menu.", "cost_pct": 0.50, "cat": "Food"},
                {"name": "Cafe Hopping & Dessert Crawl", "desc": "Visit highly-rated boutique cafes and popular local bakeries.", "cost_pct": 0.10, "cat": "Food"}
            ],
            "History": [
                {"name": "Guided Ancient Castle & Palace Tour", "desc": "Explore historical architecture and learn royal dynasties' histories.", "cost_pct": 0.10, "cat": "Activities"},
                {"name": "National History Museum Visit", "desc": "Examine archaeological relics and cultural artifacts.", "cost_pct": 0.08, "cat": "Activities"},
                {"name": "Heritage Walk in Old Town Quarter", "desc": "Walk down cobblestone pathways detailing architectural evolutions.", "cost_pct": 0.0, "cat": "Activities"}
            ],
            "Nature": [
                {"name": "Scenic Mountain Ridge Trek", "desc": "Hike through lush panoramic trails offering breathtaking vista views.", "cost_pct": 0.05, "cat": "Activities"},
                {"name": "Botanical Gardens & Conservation Park Walk", "desc": "Discover native flora and peaceful landscaped ponds.", "cost_pct": 0.07, "cat": "Activities"},
                {"name": "Sunset Coastal Cruise or Lake Boat Tour", "desc": "Unwind on a relaxing cruise capturing local shoreline elements.", "cost_pct": 0.20, "cat": "Activities"}
            ],
            "Shopping": [
                {"name": "Bustling Artisan Local Market Explore", "desc": "Browse handcraft vendors, souvenirs, and textiles.", "cost_pct": 0.05, "cat": "Shopping"},
                {"name": "Premium Outlet Mall Excursion", "desc": "Shop high-end labels and tax-free boutiques.", "cost_pct": 0.20, "cat": "Shopping"},
                {"name": "Modern Trend District Walking Street", "desc": "Wander through tech, fashion, and accessory flagships.", "cost_pct": 0.10, "cat": "Shopping"}
            ]
        }
        
        # General default activities if interests mismatch
        default_activities = [
            {"name": "City Highlights Sightseeing Bus Tour", "desc": "Great overview of the city's landmarks and geography.", "cost_pct": 0.10, "cat": "Activities"},
            {"name": "Panoramic City Observation Deck Experience", "desc": "View the city from above during golden hour.", "cost_pct": 0.15, "cat": "Activities"},
            {"name": "Relaxing Park Picnic & Leisure Walk", "desc": "Slow down and watch local daily life in a popular green area.", "cost_pct": 0.0, "cat": "Activities"}
        ]
        
        # Calculate budget base values (in USD)
        budget_multipliers = {"Economy": 50, "Moderate": 150, "Luxury": 500}
        per_day_allowance = budget_multipliers.get(budget_level, 150)
        
        schedule = []
        
        # Build day-by-day itinerary structure
        for day in range(1, days + 1):
            day_activities = []
            
            # 1. Morning - Breakfast / Orientation
            day_activities.append({
                "time": "09:00 AM",
                "activity_name": "Regional Breakfast Experience",
                "description": f"Kickstart Day {day} with a highly recommended local breakfast style near your accommodation.",
                "cost": round(per_day_allowance * 0.08),
                "category": "Food"
            })
            
            # Determine interest-based items to insert
            active_interests = [i for i in interests if i in activity_pool]
            
            # 2. Afternoon activity
            if active_interests:
                chosen_interest = random.choice(active_interests)
                item = random.choice(activity_pool[chosen_interest])
            else:
                item = random.choice(default_activities)
                
            day_activities.append({
                "time": "02:00 PM",
                "activity_name": item["name"],
                "description": item["desc"],
                "cost": round(per_day_allowance * item["cost_pct"]),
                "category": item["cat"]
            })
            
            # 3. Evening activity
            day_activities.append({
                "time": "07:30 PM",
                "activity_name": "Traditional Evening Dinner & Walk",
                "description": "Unwind with authentic regional dishes, followed by a stroll through local nightlife hubs.",
                "cost": round(per_day_allowance * 0.15),
                "category": "Food"
            })
            
            schedule.append({
                "day": day,
                "theme": f"Day {day} Exploration - {item['name']}",
                "activities": day_activities
            })
            
        # Compile final mock trip structure
        mock_payload = {
            "meta": {
                "destination": destination,
                "days": days,
                "budget_level": budget_level,
                "traveler_type": traveler_type,
                "total_estimated_cost": sum(act["cost"] for d in schedule for act in d["activities"])
            },
            "packing_checklist": [
                {"item": "Passport & Travel Documents", "cat": "Documents"},
                {"item": "Universal Charging Adapter", "cat": "Electronics"},
                {"item": "Comfortable Walking Shoes", "cat": "Clothing"},
                {"item": "Personal Toiletries Kit", "cat": "Toiletries"}
            ],
            "estimated_budget_split": [
                {"category": "Food", "amount": sum(act["cost"] for d in schedule for act in d["activities"] if act["category"] == "Food")},
                {"category": "Activities", "amount": sum(act["cost"] for d in schedule for act in d["activities"] if act["category"] == "Activities")},
                {"category": "Shopping", "amount": sum(act["cost"] for d in schedule for act in d["activities"] if act["category"] == "Shopping")},
                {"category": "Lodging (Est.)", "amount": round(per_day_allowance * 0.40 * days)}
            ],
            "schedule": schedule
        }
        
        return mock_payload
