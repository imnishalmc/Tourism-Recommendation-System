//TODO- search
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Star, MapPin, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getDestination } from '@/services/destinationService'
import type { Destination } from '@/types/destination'
import {
    DIFFICULTY_LEVELS,
    CROWD_LEVELS,
    // BUDGET_LEVELS,
} from '@/constants/categories'

const difficultyStyles: Record<string, string> = {
    easy: 'bg-soft-green text-secondary',
    moderate: 'bg-light-blue text-primary',
    hard: 'bg-primary/10 text-primary',
    very_hard: 'bg-primary/20 text-primary',
}

function label(list: { value: string; label: string }[], value: string) {
    return list.find((x) => x.value === value)?.label ?? value
}

export function DestinationDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [destination, setDestination] = useState<Destination | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return
        let cancelled = false

        async function load() {
            setLoading(true)
            setError('')
            try {
                const data = await getDestination(Number(id))
                if (!cancelled) setDestination(data)
            } catch (err) {
                if (!cancelled) setError('Could not load this destination. It may not exist, or the backend is unreachable.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => { cancelled = true }
    }, [id])

    if (loading) {
        return <p className="py-24 text-center text-muted-foreground">Loading destination...</p>
    }

    if (error || !destination) {
        return (
            <div className="py-24 text-center">
                <p className="text-destructive">{error || 'Destination not found.'}</p>
                <Link to="/destination">
                    <Button variant="outline" className="mt-6 rounded-full">
                        <ArrowLeft className="size-4" />
                        Back to Destinations
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <article className="mx-auto max-w-5xl px-5 py-12 md:px-8">
            <Link to="/destination" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" />
                Back to Destinations
            </Link>

            <div className="mt-6 overflow-hidden rounded-3xl">
                <img
                    src={destination.image_url || '/placeholder.jpg'}
                    alt={destination.name}
                    className="aspect-[16/9] w-full object-cover"
                />
            </div>

            <div className="mt-8 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{destination.name}</h1>
                    <p className="mt-1 flex items-center gap-1 text-muted-foreground">
                        <MapPin className="size-4" />
                        {destination.district} District, {destination.province}
                    </p>
                </div>
                {destination.ratings != null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-4 py-2 text-lg font-semibold">
                        <Star className="size-5 fill-amber-400 text-amber-400" />
                        {destination.ratings.toFixed(1)}
                        {destination.review_count != null && destination.review_count > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({destination.review_count} reviews)
                            </span>
                        )}
                    </span>
                )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <span className={cn('rounded-full px-4 py-1.5 text-sm font-medium', difficultyStyles[destination.difficulty_level])}>
                    {label(DIFFICULTY_LEVELS, destination.difficulty_level)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
                    <Users className="size-3.5" />
                    {label(CROWD_LEVELS, destination.crowd_level)} crowd
                </span>
                {/* <span className="inline-flex items-center gap-1 rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
                    <Wallet className="size-3.5" />
                    {label(BUDGET_LEVELS, destination.budget_level)} budget
                </span> */}
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
                    <Clock className="size-3.5" />
                    {destination.visit_duration_days != null && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
                            <Clock className="size-3.5" />
                            {destination.visit_duration_days} day{destination.visit_duration_days !== 1 ? 's' : ''}
                        </span>
                    )}        </span>
            </div>

            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                {destination.description}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                    <h3 className="font-semibold">Best Season</h3>
                    <p className="mt-1 text-muted-foreground">{destination.best_season}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Activities</h3>
                    <p className="mt-1 text-muted-foreground">{destination.activities}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Accessibility</h3>
                    <p className="mt-1 text-muted-foreground">{destination.accessibility}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Transportation</h3>
                    <p className="mt-1 text-muted-foreground">{destination.transportation}</p>
                </div>
            </div>

            {/* {destination.tags?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                    {destination.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                </div>
            )} */}
        </article>
    )
}

export default DestinationDetailPage